import { IsString, IsOptional } from 'class-validator';

export class PayoutMethodRequiredFieldsQuery {
    @IsString()
    sender_country: string;

    @IsString()
    sender_currency: string;

    @IsString()
    beneficiary_country: string;

    @IsString()
    payout_currency: string;

    @IsString()
    sender_entity_type: string;

    @IsString()
    beneficiary_entity_type: string;

    @IsString()
    @IsOptional()
    payout_amount?: string;
}
