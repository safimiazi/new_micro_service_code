import { config } from "dotenv";
import { bool, cleanEnv, port, str } from "envalid";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export function configureEnv() {
  return cleanEnv(process.env, {
    BASE_URL: str(),
    NODE_ENV: str(),
    PORT: port({ devDefault: 5000 }),
    SECRET_KEY: str(),
    ORIGIN: str({ devDefault: "*" }),
    CREDENTIALS: bool({ default: false }),
    LOG_FORMAT: str({
      default:
        ":date[web] :method :url :status :res[content-length] - :response-time ms",
    }),
    DATABASE_HOST: str({ default: "localhost" }),
    DATABASE_NAME: str(),
    DATABASE_PASSWORD: str({ devDefault: "" }),
    DATABASE_USER: str({ devDefault: "root" }),
    DATABASE_PORT: port({ devDefault: 3306 }),
    STORE_SANDBOX_SSL: bool({ default: false }),
    STORE_PASSWORD_SSL: str(),
    STORE_ID_SSL: str(),
    TELEGRAM_API: str({ devDefault: "no_api" }),
    MAIL_HOST: str(),
    MAIL_PORT: str(),
    MAIL_USER: str(),
    MAIL_PASS: str(),
  });
}

export const ENV = configureEnv();
