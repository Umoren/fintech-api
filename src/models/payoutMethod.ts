import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PayoutMethod {
    @Expose()
    @IsString()
    payout_currency: string;

    @IsOptional()
    @IsNumber()
    limit: number;
}