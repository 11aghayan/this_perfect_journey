declare namespace NodeJS {
  interface ProcessEnv {
    PG_USER: string;
    PG_HOST: string;
    PG_PORT: string;
    PG_DATABASE: string;
    PG_PASSWORD: string;
    OWNER_USERNAME: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_SECURE: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    GOOGLE_OAUTH_CLIENT_ID: string;
  }
}