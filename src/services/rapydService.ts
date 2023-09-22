import crypto from 'crypto';
import axios, { AxiosInstance } from 'axios';
import { Beneficiary } from '@/models/beneficiary';
import { Payout } from '../models/payout';
import { PayoutMethod } from '@/models/payoutMethod';
import HttpMethod from 'http-method-enum';
import config from '../config/config';
import { logger } from '../utils/logger';
import { HttpException } from '../exceptions/HttpException';
import { RapydResponse } from '@/models/baseRapydResponse';
import { PayoutMethodRequiredFieldsQuery } from '@/models/payoutMethodRequiredFields';
import { CompletePayout } from '@/models/completePayout';

class RapydService {
    private _accessKey: string;
    private _secretKey: string;
    private _baseUrl: string;
    private _axiosClient: AxiosInstance;

    constructor() {
        this._accessKey = config.accessKey;
        this._secretKey = config.secretKey;
        this._baseUrl = config.baseRapydApiUrl;

        this._axiosClient = axios.create({
            baseURL: this._baseUrl,
        });

        this._axiosClient.interceptors.request.use(req => {
            const method = req.method as HttpMethod;
            const salt = this.generateRandomString(8);
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = this.generateSignature(method, req.url, salt, timestamp, req.data);
            req.headers.salt = salt;
            req.headers.timestamp = timestamp;
            req.headers.access_key = this._accessKey;
            req.headers.signature = signature;
            req.headers['Content-Type'] = 'application/json';
            return req;
        });
    }

    // Create a new beneficiary
    public async createBeneficiary(body: Beneficiary): Promise<any> {
        // Implement the API call to create a beneficiary
        try {
            const response = await this._axiosClient.post<RapydResponse<Beneficiary>>('/v1/payouts/beneficiary', body);
            return response.data
        } catch (error) {
            if (error.isAxiosError) {
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
        }
    }

    // Get a beneficiary
    public async getBeneficiaries(beneficiaryId: string): Promise<Beneficiary[]> {
        try {
            const response = await this._axiosClient.get<RapydResponse<Beneficiary[]>>(`/v1/payouts/beneficiary/${beneficiaryId}`);

            return response.data?.data;
        } catch (error) {
            if (error.isAxiosError) {
                // Handle the error based on your application's requirements
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
            throw error;
        }

    }

    // Create a new payout
    public async createPayout(body: Payout): Promise<any> {
        // Implement the API call to create a payout
        try {
            const response = await this._axiosClient.post<RapydResponse<Payout>>('/v1/payouts', body);
            return response.data
        } catch (error) {
            if (error.isAxiosError) {
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
        }
    }

    // Get a list of payout methods
    public async getPayoutMethodTypes(payout_currency: string): Promise<PayoutMethod[]> {
        try {
            const response = await this._axiosClient.get<RapydResponse<PayoutMethod[]>>(`/v1/payouts/supported_types?payout_currency=${payout_currency}`);
            return response.data?.data;
        } catch (error) {
            if (error.isAxiosError) {
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
            throw error;
        }
    }

    public async getPayoutMethodRequiredFields(payout_method_type: string, queryParams: PayoutMethodRequiredFieldsQuery): Promise<any> {
        try {
            const queryString = Object.entries(queryParams)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            const url = `/v1/payouts/${payout_method_type}/details?${queryString}`;
            const response = await this._axiosClient.get(url);
            return response.data;
        } catch (error) {
            console.error('this is an error', error);
            throw new HttpException(error.response?.status, error.response?.data || 'An error occurred');
        }
    }


    public async getPayouts(): Promise<Payout[]> {
        try {
            const response = await this._axiosClient.get<RapydResponse<Payout[]>>('/v1/payouts');
            return response.data?.data;
        } catch (error) {
            if (error.isAxiosError) {
                // Handle the error based on your application's requirements
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
            throw error;
        }
    }

    public async getPayout(payoutId: string): Promise<Payout[]> {
        try {
            const response = await this._axiosClient.get<RapydResponse<Payout[]>>(`/v1/payouts/${payoutId}`);
            return response.data?.data;
        } catch (error) {
            if (error.isAxiosError) {
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
            throw error;
        }
    }

    public async confirmPayout(payoutId: string): Promise<any> {
        try {
            const response = await this._axiosClient.post<RapydResponse<any>>(`/v1/payouts/confirm/${payoutId}`);
            return response.data;
        } catch (error) {
            if (error.isAxiosError) {
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
            throw error;
        }
    }

    public async completePayout(payout: string, amount: number): Promise<any> {
        try {
            const url = `/v1/payouts/complete/${payout}/${amount}`;
            const response = await this._axiosClient.post<RapydResponse<CompletePayout>>(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw new HttpException(error.response?.status, error.response?.data || 'An error occurred');
        }
    }

    public async cancelPayout(payoutId: string): Promise<any> {
        try {
            const response = await this._axiosClient.delete<RapydResponse<any>>(`/v1/payouts/cancel/${payoutId}`);
            return response.data;
        } catch (error) {
            if (error.isAxiosError) {
                throw new HttpException(+error.response.status, error.response.data?.status || error.response.data);
            }
            throw error;
        }
    }

    public authWebhookRequest(incomeSign: string, url: string, salt: string, timestamp: number, body: string): boolean {
        const signature = this.generateSignatureForWebhookAuth(url, salt, timestamp, body);

        return signature === incomeSign;
    }


    private generateSignature(method: HttpMethod, urlPath: string, salt: string, timestamp: number, body: any): string {
        try {
            let bodyString = '';
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == '{}' ? '' : bodyString;
            }

            const toSign = method.toLowerCase() + urlPath + salt + timestamp + this._accessKey + this._secretKey + bodyString;
            return this.hashSignature(toSign, this._secretKey);
        } catch (error) {
            logger.error('Error generating signature');
            throw error;
        }
    }

    private generateSignatureForWebhookAuth(url: string, salt: string, timestamp: number, body: any): string {
        try {
            let bodyString = '';
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == '{}' ? '' : bodyString;
            }

            const toSign = url + salt + timestamp + this._accessKey + this._secretKey + bodyString;
            // console.log('toSign', toSign);

            return this.hashSignature(toSign, this._secretKey);
        } catch (error) {
            logger.error('Error generating signature');
            throw error;
        }
    }

    private hashSignature(signature: string, key: string): string {
        const hash = crypto.createHmac('sha256', key);
        hash.update(signature);
        const hashSignature = Buffer.from(hash.digest("hex")).toString('base64');

        return hashSignature;
    }
    private generateRandomString(size: number): string {
        return crypto.randomBytes(size).toString('hex');
    }
}


export default RapydService;
