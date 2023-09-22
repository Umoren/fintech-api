import { Post, Req, HeaderParam, Body, JsonController, Get } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { WebhookEvent } from '@/models/webhookEvent';
import RapydService from '@/services/rapydService';
import { Request } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import webhookEventService from '@/services/webhookEventService';
@JsonController('/api')
export class WebhookEventController {

    @Get('/webhook/events')
    @OpenAPI({ summary: 'Return a list of events' })
    @ResponseSchema(WebhookEvent, { isArray: true })
    async getEvents() {
        const events = webhookEventService.getAllEvents();

        return events;
    }

    @Post('/webhook')
    @OpenAPI({ summary: 'Saves triggered rapyd actions' })
    async saveEvent(
        @Req() request: Request,
        @HeaderParam('signature') signature: string,
        @HeaderParam('timestamp') timestamp: number,
        @HeaderParam('salt') salt: string,
        @Body() body: any,
    ) {
        const rapydService = new RapydService();
        const url = `https://${request.hostname}${request.path}`;
        console.log('url', url)
        if (!rapydService.authWebhookRequest(signature, url, salt, timestamp, body)) {
            throw new HttpException(401, 'Signature not valid');
        }
        const eventId = body.id;
        const eventType = body.type;
        const data = body.data;

        if (!eventId || !eventType || !data) {
            throw new HttpException(400, 'Bad Request');
        }
        const status = webhookEventService.tryAddEvent(eventId, eventType, data);

        return status;
    }
}
