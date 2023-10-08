import { expect, assert, should } from 'chai';
import RapydService from '../../services/rapydService';

should()

describe('RapydService Tests', () => {
    let rapydService: RapydService;

    beforeEach(() => {
        rapydService = new RapydService();
    });

    it('should create a new beneficiary', async () => {
        const newBeneficiary = {
            category: "bank",
            country: "US",
            currency: "USD",
            entity_type: "individual",
            first_name: "Peace",
            last_name: "Downing",
            identification_type: "identification_id",
            identification_value: "12p3456178h9",
            merchant_reference_id: "ref_123",
            address: "123 Main St",
            city: "Springfield",
            state: "IL",
            postcode: "62704",
            account_number: "777110203456785",
            bank_name: "Bank of Springfield",
            bic_swift: "BARCGB22",
            payment_type: "bank"
        };
        const result = await rapydService.createBeneficiary(newBeneficiary);

        result.should.have.nested.property('status.status').equal('SUCCESS');

        const { data } = result;

        expect(data).to.include.all.keys('id', 'last_name', 'first_name', 'country');

        assert.typeOf(data.id, 'string', 'ID should be a string');

        expect(data).to.include({
            last_name: newBeneficiary.last_name,
            first_name: newBeneficiary.first_name,
            country: newBeneficiary.country,
            entity_type: newBeneficiary.entity_type
        });

        data.should.have.property('address').which.is.a('string').and.equals(newBeneficiary.address);

        data.should.have.property('currency').which.is.a('string').and.oneOf(['USD', 'EUR']); // if you expect multiple possible values

        data.should.deep.include({
            identification_type: newBeneficiary.identification_type,
            bank_name: newBeneficiary.bank_name
        });
    });

    it('should create a new payout', async () => {
        const newPayout = {
            beneficiary: {
                payment_type: "regular",
                last_name: "Tanner",
                first_name: "Luke",
                country: "US",
                entity_type: "individual",
                address: "1 Main Street",
                postcode: "12345",
                city: "Anytown",
                state: "NY",
                account_number: "777110203456785",
                bic_swift: "FGBCUS66",
                aba: 573675777,
                bank_account_type: "Checking"
            },
            beneficiary_country: "US",
            beneficiary_entity_type: "individual",
            description: "des c15622888",
            payout_method_type: "us_general_bank",
            ewallet: "ewallet_4baa1b14c3e3f30a594702d39a588ab6",
            recurrenceFrequency: "weekly",
            nextPayoutDate: new Date("2023-09-20T00:00:00.000Z"),
            metadata: {
                merchant_defined: true
            },
            payout_amount: 50,
            payout_currency: "USD",
            sender: {
                first_name: "Sam",
                last_name: "Downing",
                identification_type: "work_permit",
                identification_value: "asdasd123123",
                phone_number: 19019019011,
                occupation: "developer",
                city: "Anytown",
                state: "NY",
                postcode: "10101",
                source_of_income: "business",
                date_of_birth: "11/12/1913",
                address: "1 Main Street",
                country: "US",
                company_name: "X company"
            },
            confirm_automatically: true,
            sender_country: "US",
            sender_currency: "USD",
            sender_entity_type: "individual"
        };
        const result = await rapydService.createPayout(newPayout);

        result.should.have.nested.property('status.status').equal('SUCCESS');

        const { data } = result;

        assert.typeOf(data.id, 'string', 'ID should be a string');
    });

    it('should complete a payout and change its status', async () => {
        const payoutId = 'payout_6848341a4cb9fc8e4293fa5c0dd8b597';
        const amount = 1
        const result = await rapydService.completePayout(payoutId, amount);


        result.should.have.nested.property('data.status').equal('Completed');
    });
});


