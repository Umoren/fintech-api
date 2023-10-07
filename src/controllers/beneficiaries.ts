import { Param, Body, Get, Post, HttpCode, UseBefore, JsonController } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { validationMiddleware } from '../middlewares/validation.middleware';
import RapydService from '../services/rapydService';
import { Beneficiary } from '../models/beneficiary';

@JsonController('/api')
export class BeneficiaryController {

    @Get('/beneficiaries/:beneficiaryId')
    @OpenAPI({ summary: 'Return a beneficiary' })
    @ResponseSchema(Beneficiary)
    async getBeneficiaries(@Param('beneficiaryId') beneficiaryId: string) {
        const rapydService = new RapydService();
        const beneficiaries = await rapydService.getBeneficiaries(beneficiaryId);
        return beneficiaries;
    }

    @Post('/beneficiaries')
    @HttpCode(200)
    @UseBefore(validationMiddleware(Beneficiary, 'body'))
    @ResponseSchema(Beneficiary)
    @OpenAPI({ summary: 'Create a new beneficiary' })
    async createBeneficiary(@Body() body: Beneficiary) {
        const rapydService = new RapydService();
        const beneficiary = await rapydService.createBeneficiary(body);
        return beneficiary;
    }
}