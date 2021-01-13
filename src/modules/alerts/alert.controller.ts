import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AlertsGateway } from './alerts.gateway';

@Controller('alerts')
export class AlertsController {
    constructor(private alertsGateway: AlertsGateway){
    }

    @Post()
    @HttpCode(200)
    sendAlertToAll(@Body() dto: { message: string }) {
        this.alertsGateway.sendAlert(dto.message)
        return dto
    }
}
