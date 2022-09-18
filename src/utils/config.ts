import { Type, Static } from '@sinclair/typebox';
import envSchema from 'env-schema';

export enum ENV_ENUM {
   prod = 'prod',
   dev = 'dev',
   test = 'test',
}

const schema = Type.Object({
   PORT: Type.Number({
      default: 5000,
   }),
   APP_NAME: Type.String({
      default: 'Messenger',
   }),
   SERVER_ORIGIN: Type.String({
      default: 'http://localhost:5000',
   }),
   CLIENT_ORIGIN: Type.String({
      default: 'http://localhost:3000',
   }),
   REF_COOKIE_NAME: Type.String({
      default: 'token',
   }),
   GOOGLE_OAUTH_CLIENT_ID: Type.String(),
   GOOGLE_OAUTH_CLIENT_SECRET: Type.String(),
   GOOGLE_OAUTH_REDIRECT_URL: Type.String(),
   EMAIL_TRANSPORTER: Type.String(),
   PASSWORD_TRANSPORTER: Type.String(),
   DEV_DB_URL: Type.String(),
   TEST_DB_URL: Type.String(),
   PROD_DB_URL: Type.String(),
   NODE_ENV: Type.Enum(ENV_ENUM),
});

type Env = Static<typeof schema>;

export const config = envSchema<Env>({
   dotenv: true,
   env: true,
   schema,
});
