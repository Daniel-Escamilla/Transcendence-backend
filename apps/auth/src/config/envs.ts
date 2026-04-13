import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const schema = joi
  .object<EnvVars>({
    PORT: joi.number().integer().positive().default(3001),
    NATS_SERVERS: joi.array().items(joi.string()).min(1).required(),
    DATABASE_URL: joi.string().uri({ scheme: [/postgresql/] }).required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().default('7d'),
  })
  .unknown(true);

const { error, value } = schema.validate({
  ...process.env,
  NATS_SERVERS: process.env['NATS_SERVERS']?.split(',').map((server) => server.trim()),
});

if (error) {
  throw new Error(`Auth config validation error: ${error.message}`);
}

const envVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
};
