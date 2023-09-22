
import { IsString } from "class-validator";
export class CompletePayout {
    @IsString()
    payout: string;

    @IsString()
    amount: number;
}
