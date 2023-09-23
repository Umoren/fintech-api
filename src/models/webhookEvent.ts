import { IsObject, IsString } from "class-validator";

export enum EventType {
    COMPLETED = 'completed',
    CREATED = 'created',
    CANCELED = 'canceled',
    EXPIRED = 'expired'
}

export class WebhookEvent {

    constructor(id: string, eventType: EventType, data: Record<string, unknown>) {
        this.id = id;
        this.eventType = eventType;
        this.data = data;
        this.timestamp = new Date();
    }

    @IsString()
    id: string;

    eventType: EventType;

    @IsObject()
    data: Record<string, unknown>; // Define the specific payload structure based on the Rapyd Disburse API

    @IsString()
    timestamp: Date;
}
