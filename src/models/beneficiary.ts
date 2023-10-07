import { IsOptional, IsString } from "class-validator";

export class Beneficiary {
    @IsString()
    category: string;

    @IsString()
    country: string;

    @IsString()
    currency: string;

    @IsString()
    entity_type: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    identification_type: string;

    @IsString()
    identification_value: string;

    @IsString()
    merchant_reference_id: string;

    @IsOptional()
    @IsString()
    payment_type: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    postcode: string;

    @IsString()
    account_number: string;

    @IsString()
    bank_name: string;

    @IsString()
    bic_swift: string;
}
