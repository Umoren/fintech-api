import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException'
import RapydService from '../services/rapydService';

export const dynamicValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { payout_method_type, sender, beneficiary } = req.body;
    const rapydService = new RapydService();
    const {
        sender_country,
        sender_currency,
        beneficiary_country,
        payout_currency,
        sender_entity_type,
        beneficiary_entity_type,
        payout_amount
    } = req.body;

    try {
        const requiredFields = await rapydService.getPayoutMethodRequiredFields(payout_method_type, {
            sender_country,
            sender_currency,
            beneficiary_country,
            payout_currency,
            sender_entity_type,
            beneficiary_entity_type,
            payout_amount
        });

        if (!requiredFields || !requiredFields.data || !Array.isArray(requiredFields.data.beneficiary_required_fields)) {
            throw new Error('Failed to fetch or parse required fields from the API.');
        }


        const missingBeneficiaryFields = [];
        const missingSenderFields = [];

        // Validate beneficiary_required_fields
        for (const field of requiredFields.data.beneficiary_required_fields) {
            if (field.is_required && !beneficiary[field.name]) {
                missingBeneficiaryFields.push(`beneficiary.${field.name}`);
            }
        }

        // Validate sender_required_fields
        for (const field of requiredFields.data.sender_required_fields) {
            if (field.is_required && !sender[field.name]) {
                missingSenderFields.push(`sender.${field.name}`);
            }
        }

        if (missingBeneficiaryFields.length > 0 || missingSenderFields.length > 0) {
            throw new HttpException(400, `Missing required fields: ${missingBeneficiaryFields.join(', ')}, ${missingSenderFields.join(', ')}`);
        }

        next();
    } catch (error) {
        console.error('Validation Error:', error);
        console.error('Request Body:', req.body);
        next(error);
    }
};

