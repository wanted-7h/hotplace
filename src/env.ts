import { z } from "./zod_openapi";

const nonempty = z.string().min(1);
const natural = z.number().int().positive();

export const dbSchema = z
  .object({
    DB_USER_NAME: nonempty.default("hotplace_user"),
    DB_PASSWORD: nonempty.default("1234"),
    DB_DATABASE: nonempty.default("hotplace"),
    DB_HOST: nonempty.url().or(nonempty.ip()).default("127.0.0.1"),
  })
  .describe("MySQL 연결 정보")
  .transform((x) => ({
    username: x.DB_USER_NAME,
    password: x.DB_PASSWORD,
    database: x.DB_DATABASE,
    host: x.DB_HOST,
    dialect: "mysql" as const,
  }));

export const envSchema = z.object({
  JWT_SECRET_KEY: nonempty.default("secret"),
  JWT_SALT_ROUNDS: natural.default(10),

  ACCESS_TOKEN_EXPIRE: nonempty.default("1m"),
  REFRESH_TOKEN_EXPIRE_SECOND: natural.default(60 * 3),
  REFRESH_TOKEN_EXPIRE_BY_NUMBER: natural.default(60 * 60 * 24 * 1),

  API_KEY: nonempty,
});

export const env = envSchema.parse(process.env);
