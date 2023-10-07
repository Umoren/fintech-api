import chai from 'chai';
import chaiHttp from 'chai-http';
import App from '../../app';
import { PayoutController } from "../../controllers/payouts";  // Import the PayoutController

chai.use(chaiHttp);
const { expect } = chai;

const appInstance = new App([PayoutController]);  // Initialize with PayoutController
const app = appInstance.getServer();

describe('Payout Tests', () => {

    // Test for creating a payout
    it('should create a new payout', function (done) {
        this.timeout(4000);
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
            ewallet: "ewallet_9811b43025f155ec649200b3c5f428b6",
            recurrenceFrequency: "weekly",
            nextPayoutDate: "2023-09-20T00:00:00.000Z",
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
            confirm_automatically: "true",
            sender_country: "US",
            sender_currency: "USD",
            sender_entity_type: "individual"
        };


        chai.request(app)
            .post('/api/payouts')
            .send(newPayout)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.data.payout_fees).to.be.null;
                expect(res.body.data.metadata.merchant_defined).to.be.true;
                expect(res.body.data).to.be.an('object');
                done();
            });
    });

    // Test for fetching a payout by ID
    it('should fetch a payout by ID', (done) => {
        const payoutId = 'payout_6397eb925738dceebe7b26dbeb7c2939';

        chai.request(app)
            .get(`/api/payouts/${payoutId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('amount');
                done();
            });
    });
});
