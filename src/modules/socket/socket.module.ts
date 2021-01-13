import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { SocketGateway } from './socket.gateway';
import { AlertsController } from '../alerts/alert.controller';
import { AlertsGateway } from '../alerts/alerts.gateway';

@Module({
    providers: [SocketGateway, ChatGateway],
    controllers: []
})
export class SocketModule {}
