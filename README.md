# Rapyd Gig Economy Payment App

## Description

This project serves as a backend API for a gig economy payment application. It leverages the Rapyd Disburse API to handle various payment-related functionalities such as creating beneficiaries, initiating payouts, and more. The API is designed to be robust, secure, and easily extendable.

## Table of Contents

- [Rapyd Gig Economy Payment App](#rapyd-gig-economy-payment-app)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [API Documentation](#api-documentation)
  - [Webhooks](#webhooks)
    - [Webhook Endpoints](#webhook-endpoints)
    - [Setting up with ngrok](#setting-up-with-ngrok)
  - [Contributing](#contributing)

## Installation

```bash
git clone https://github.com/officialsamtech/gig-economy-payment-app.git
npm install
```

Create a `.env` file and populate it with the necessary environment variables (see `.env.example` for reference).

Run the application:

```bash
npm run dev
```

## Usage

To interact with the API, you can use tools like Postman or CURL. The API is hosted at `http://localhost:5000/api`.

## API Endpoints

- **Create Beneficiary**: `POST /api/beneficiaries`
- **Get Beneficiary**: `GET /api/beneficiaries/:id`
- **Create Payout**: `POST /api/payouts`
- **Get Payout**: `GET /api/payouts/:id`
- **Complete Payout**: `POST /api/payouts/complete/:id/:amount`
- **List Payout Method Types**: `GET /api/payoutMethods?payout_currency`
- **List Payout Method Required Fields**: `GET /api/payouts/:payout_method_type/details`

... (list all the endpoints)

## API Documentation

The API documentation is generated using OpenAPI and Swagger UI. It can be accessed at `http://localhost:5000/api-docs`.

## Webhooks

### Webhook Endpoints

- **Webhook Listener**: `POST /api/webhook`
- **Get Webhook Events**: `GET /api/webhook/events`


### Setting up with ngrok

1. Download and install [ngrok](https://ngrok.com/).
2. Run ngrok to expose your local server:
    ```bash
    ngrok http 5000
    ```
3. Copy the HTTPS URL provided by ngrok.
4. Go to the [Rapyd dashboard](https://dashboard.rapyd.net/developers/webhooks/management) and set the webhook URL to the ngrok HTTPS URL.
5. Select these events under Rapyd Disburse: ![Select Events](https://i.imgur.com/3YBC0eg.png)

For more details, follow the instructions in the [Rapyd documentation on defining a Webhook endpoint](https://docs.rapyd.net/en/defining-a-webhook-endpoint.html).


## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.
