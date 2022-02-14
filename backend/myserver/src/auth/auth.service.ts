import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { jwtConstants } from 'src/config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { getCustomRepository, getRepository } from 'typeorm';
import { SignUpDTO } from 'src/type/signup.dto';
import { RestrictedListReopsitory, UserRepository } from 'src/db/repository/User/UserCustomRepository';
import { User } from 'src/db/entity/User/UserEntity';
import { Response } from 'express';
import { authenticator } from 'otplib'
import { toFileStream } from 'qrcode'
import {TokenPayload} from 'src/type/PayLoad.interface'

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService : JwtService,
    ) {}

  async findUser(email : string) {
    const repo_user = getCustomRepository(UserRepository);
    const user = await repo_user.findOne({email : email});
    return user;
  }

  async createUser(email : string) {
    const repoUser = getCustomRepository(UserRepository);
    const user = repoUser.createNotRegisteredUser(email);
    await repoUser.insert(user);
    return user;
  }

  async register(userid : string, data : SignUpDTO) {
    const repoUser = getCustomRepository(UserRepository);
    await repoUser.register(userid, data.nickname, data.profile);
  }

  async login(user : User) {
    const {accessToken, ...accessOptions} = this.getCookieWithJwtAccessToken(user.userid);
    const {refreshToken, ...refreshOptions} = this.getCookieWithJwtRefreshToken();
    const repo_user = getCustomRepository(UserRepository);
    repo_user.login(user, refreshToken);
    return {
      accessToken : accessToken,
      accessOptions : accessOptions,
      refreshToken : refreshToken,
      refreshOptions : refreshOptions,
    }
  }

  async logout(res : Response, user : User) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    const repoUser = getCustomRepository(UserRepository);
    repoUser.logout(user);
  }
  
  async isDuplicate(nickname : string) : Promise<boolean> {
    const repoUser = getCustomRepository(UserRepository)
    const res = await repoUser.doesNickExist(nickname);
    return res
  }

  async deleteUser(res : Response, user: User, ) {
    await (this.logout(res, user) && this.addRestricteList(user));
    const repoUser = getCustomRepository(UserRepository)
    repoUser.remove(user);
  }

  async addRestricteList(user : User) {
    const repoList = getCustomRepository(RestrictedListReopsitory);
    const list = await repoList.createList(user.email);
    await repoList.insert(list);
  }



  async hashing(password: string) {
    const saltOrRounds = 10; //env
    const encodedPassword = await hash(password, saltOrRounds);
    return encodedPassword;
  }

  // Two Factor 

//   async setTwoFactorAthenticationSecret(secret : string, userid : string) {
//     const repoUser = getCustomRepository(UserRepository);
//     await repoUser.update(userid, {twoFactorAuthenticationSecret : secret})
//   }

//   public async generateTwoFactorAuthnticateSecret(user : User) {
//     const TWO_FACTOR_AUTHENTICATION_APP_NAME = 'pong game'  //config
//     const secret = authenticator.generateSecret();
//     const otpauthUrl = authenticator.keyuri(user.email, 
//         TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
//     await this.setTwoFactorAthenticationSecret(secret, user.userid)
//     return {
//         secret, 
//         otpauthUrl
//     }
//   }

// async turnOnTwoFactorAuthentication(userId : string) {
//     const repo_user = getCustomRepository(UserRepository);
//     return repo_user.update(userId, {isTwoFactorAuthenticationEnabled : true})
// }

//   public async pipeQrCodeStream(res : Response, otpauthUrl : string) {
//     return toFileStream(res, otpauthUrl);
//   }

//   public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode : string, user : User) {
//     return authenticator.verify({
//         token : twoFactorAuthenticationCode,
//         secret : user.twoFactorAuthenticationSecret
//     })
//   }

  public getCookieWithJwtAccessToken(userid : string, isSecondFactorAuthenticated = false) {
    const payload : TokenPayload = {userid, isSecondFactorAuthenticated};
    const atExpireIn = jwtConstants.getByms('at');
    const token = this.jwtService.sign(payload, {
        secret : jwtConstants.secret,
        expiresIn : atExpireIn
    })
    return {
      accessToken : token, 
      maxAge : atExpireIn,
      httpOnly : true,
      domain : "localhost", 
      path :"/"
    }
  }

  public getCookieWithJwtRefreshToken() {
    const rtExpireIn = jwtConstants.getByms('at');
    const token = this.jwtService.sign({
      secret : jwtConstants.secret,
      expiresIn : rtExpireIn
    })
    return {
      refreshToken : token, 
      maxAge : rtExpireIn,
      httpOnly : true,
      domain : "localhost", 
      path :"/"
    }
  }

// public async setCurrentRefreshToken(refreshToken : string, userId : string) { 
//   const repo_user = getCustomRepository(UserRepository);
//   await repo_user.update(userId, {refreshToken : refreshToken});
// }

  async validateJwt(payload : TokenPayload) {
    const repoUser = getCustomRepository(UserRepository);
    const user = await repoUser.findOne({userid : payload.userid});
    if (!user)
      throw new BadRequestException("No such user");
    if (!user.isTwoFactorAuthenticationEnabled)
      return user;
    if (payload.isSecondFactorAuthenticated)
      return user;
    else
      throw new UnauthorizedException("2fa");
  }

  async validate2FAJwt(payload : TokenPayload) {
    const repoUser = getCustomRepository(UserRepository);
    const user = await repoUser.findOne({userid : payload.userid});
    if (user === undefined)
      throw new BadRequestException("No such user");
    return user;
  }
}