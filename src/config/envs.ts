
import 'dotenv/config';
import Joi, * as joi from 'joi';


interface EnvVars {
    PORT: number;
    PRODUCTS_MICROSERVICE_HOST: string;
    PRODUCTS_MICROSERVICE_PORT: number;
    ORDERS_MICROSERVICE_PORT: number;
    ORDERS_MICROSERVICE_HOST: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required(),        
    ORDERS_MICROSERVICE_PORT: joi.number().required(),
    ORDERS_MICROSERVICE_HOST: joi.string().required()
}).unknown(true);

const {error, value} = envsSchema.validate(process.env);

if (error){
    throw new Error(`Config validatrion error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
    productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
    orderMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
    orderMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST
}