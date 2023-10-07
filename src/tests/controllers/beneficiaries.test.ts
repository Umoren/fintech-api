import chai from 'chai';
import chaiHttp from 'chai-http';
import App from '../../app';
import { BeneficiaryController } from "../../controllers/beneficiaries"

chai.use(chaiHttp);
const { expect } = chai;

const appInstance = new App([BeneficiaryController]);
const app = appInstance.getServer();

describe('Beneficiary Tests', () => {



    // Test for creating a beneficiary
    it('should create a new beneficiary', (done) => {
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
            bic_swift: "BARCGB22"
        };

        chai.request(app)
            .post('/api/beneficiaries')
            .send(newBeneficiary)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.data).to.have.property('category');
                done();
            });
    });

    // Test for fetching a beneficiary
    it('should fetch a beneficiary by ID', (done) => {
        const beneficiaryId = 'beneficiary_090df18e6369e5465a88e110ffa00c40';

        chai.request(app)
            .get(`/api/beneficiaries/${beneficiaryId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('category');
                done();
            });
    });

});
