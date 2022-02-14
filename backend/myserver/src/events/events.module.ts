import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WSAuthGuard } from 'src/chat/ws-guard';
import { WSJwtStrategy } from 'src/chat/ws-jst.strategy';
import { AuthGateway } from './Auth.gateway';
import { ChatGateway } from './chat.gateway';
import { GameGateway } from './game.gateway';
import { GameGatewayService } from './gameGateway.service';
import { UserGateway } from './user.gateway';
import { UserGatewayService } from './userGateway.service';
import { ChatGatewayService } from './chatGateway.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports : [AuthModule],
    providers: [AuthGateway, ChatGateway, UserGateway, GameGateway, WSAuthGuard, WSJwtStrategy, UserGatewayService, ChatGatewayService, GameGatewayService],
    exports: [ChatGateway, UserGateway, GameGateway]
})
export class EventsModule {}
