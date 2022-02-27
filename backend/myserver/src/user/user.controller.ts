import { Controller, Get, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/db/entity/User/UserEntity";
import { UserRepository } from "src/db/repository/User/User.repository";
import { UserDeco } from "src/type/user.decorator";
import { getCustomRepository } from "typeorm";
import { UserService } from "./user.service";

@Controller('user')

export class UserController {
    constructor(
        private readonly userService : UserService, 
    ) {}

    @Get('/check')
    @UseGuards(AuthGuard('jwt'))
    async checkState(@UserDeco() user: User) {
        // const user = await getCustomRepository(UserRepository).findOne({nickname : "jikwon"});
        const state = await this.userService.findState(user);
        return {state};
    }
}