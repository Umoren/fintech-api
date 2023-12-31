import 'reflect-metadata';
import config from './config/config';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import hpp from 'hpp';
import morgan from 'morgan';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';

class App {
    public app: express.Application;
    public port: string | number;
    public env: string;

    constructor(Controllers: Function[]) {
        this.app = express();
        this.port = config.port;
        this.env = process.env.NODE_ENV || 'development';

        this.initializeMiddlewares();
        this.initializeRoutes(Controllers);
        this.initializeSwagger(Controllers);
        this.initializeErrorHandling();
    }

    public listen() {

        try {
            this.app.listen(this.port, () => {
                logger.info("=================================");
                logger.info(`======= ENV: ${this.env} =======`);
                logger.info(`🚀 App listening on the port ${this.port}`);
                logger.info("=================================");
            });

        } catch (error) { console.error("error", error) }

    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(morgan('dev', { stream }));
        this.app.use(hpp());
        this.app.use(compression());

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private initializeRoutes(controllers: Function[]) {
        useExpressServer(this.app, {
            cors: {
                origin: '*',
                credentials: true,
            },
            controllers: controllers,
            defaultErrorHandler: false,
        });
    }

    private initializeSwagger(controllers: Function[]) {
        const schemas = validationMetadatasToSchemas({
            classTransformerMetadataStorage: defaultMetadataStorage,
            refPointerPrefix: '#/components/schemas/',
        });

        const routingControllersOptions = {
            controllers: controllers,
        };

        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(storage, routingControllersOptions, {
            components: {
                schemas,
                securitySchemes: {
                    basicAuth: {
                        scheme: 'basic',
                        type: 'http',
                    },
                },
            },
            info: {
                description: 'Generated with `routing-controllers-openapi`. Features include beneficiary management, payout creation, and webhook integrations for real-time updates',
                title: 'Sample Rapyd Disburse App API',
                version: '1.0.0',
            },
        });

        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;