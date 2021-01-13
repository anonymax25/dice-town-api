import { Module } from '@nestjs/common';
import { AlertsController } from './alert.controller';
import { AlertsGateway } from './alerts.gateway';

@Module({
    providers: [AlertsGateway],
    controllers: [AlertsController]
})
export class AlertsModule {}
