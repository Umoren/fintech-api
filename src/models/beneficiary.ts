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

    constructor(
        category: string,
        country: string,
        currency: string,
        entity_type: string,
        first_name: string,
        last_name: string,
        identification_type: string,
        identification_value: string,
        merchant_reference_id: string,
        payment_type: string,
        address: string,
        city: string,
        state: string,
        postcode: string,
        account_number: string,
        bank_name: string,
        bic_swift: string
    ) {
        this.category = category;
        this.country = country;
        this.currency = currency;
        this.entity_type = entity_type;
        this.first_name = first_name;
        this.last_name = last_name;
        this.identification_type = identification_type;
        this.identification_value = identification_value;
        this.merchant_reference_id = merchant_reference_id;
        this.payment_type = payment_type;
        this.address = address;
        this.city = city;
        this.state = state;
        this.postcode = postcode;
        this.account_number = account_number;
        this.bank_name = bank_name;
        this.bic_swift = bic_swift;
    }
}
