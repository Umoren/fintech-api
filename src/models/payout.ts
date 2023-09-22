import { IsBoolean, IsString, IsObject, ValidateNested, IsNumber, IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class Payout {
    @IsString()
    beneficiary_country: string;

    @IsString()
    beneficiary_entity_type: string;

    @IsBoolean()
    confirm_automatically: boolean;

    @IsString()
    description: string;

    @IsNumber()
    payout_amount: number;

    @IsString()
    payout_method_type: string;

    @IsString()
    payout_currency: string;

    @IsObject()
    @ValidateNested()
    @Type(() => Object)
    sender: Record<string, any>;

    @IsString()
    sender_country: string;

    @IsString()
    sender_currency: string;

    @IsString()
    sender_entity_type: string;

    @IsObject()
    @ValidateNested()
    @Type(() => Object)
    beneficiary: Record<string, any>;

    // New fields for recurring payments
    @IsString()
    @IsOptional()
    recurrenceFrequency: string;  // 'weekly', 'monthly', etc.

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    nextPayoutDate: Date;  // The date for the next scheduled payout
}
