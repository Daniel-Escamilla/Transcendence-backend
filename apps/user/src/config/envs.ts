import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  DATABASE_URL: string;
}

const schema = joi
  .object<EnvVars>({
    PORT: joi.number().integer().positive().default(3002),
    NATS_SERVERS: joi.array().items(joi.string()).min(1).required(),
    DATABASE_URL: joi.string().uri({ scheme: [/postgresql/] }).required(),
  })
  .unknown(true);

const { error, value } = schema.validate({
  ...process.env,
  NATS_SERVERS: process.env['NATS_SERVERS']?.split(',').map((server) => server.trim()),
});

if (error) {
  throw new Error(`User config validation error: ${error.message}`);
}

const envVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  databaseUrl: envVars.DATABASE_URL,
};
