import 'dotenv/config';
import App from './app';

// Import your controllers
import { IndexController } from '@/controllers/index';
import { BeneficiaryController } from '@/controllers/beneficiaries';
import { PayoutController } from '@/controllers/payouts';
import { WebhookEventController } from '@/controllers/webhook';

import validateEnv from './utils/validateEnv'; // Utility to validate environment variables

// Validate environment variables before starting the app
validateEnv();

// Initialize the App class and pass in your controllers
const app = new App([
    IndexController,
    BeneficiaryController,
    PayoutController,
    WebhookEventController
]);


// Start the application
app.listen();
