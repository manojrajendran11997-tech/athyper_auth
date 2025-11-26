// pages/api/ariba-service/config.ts

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export const ARIBA = {
  REALM: process.env.ARIBA_REALM!,
  USER: process.env.ARIBA_USER!,
  PASSWORD_ADAPTER: process.env.ARIBA_PASSWORD_ADAPTER!,

  API_BASE: process.env.ARIBA_API_BASE!,
  APPLICATION_KEY: process.env.ARIBA_APPLICATION_KEY!,
  CLIENT_ID: process.env.ARIBA_CLIENT_ID!,
  CLIENT_SECRET: process.env.ARIBA_CLIENT_SECRET!,
  OAUTH_URL: process.env.ARIBA_OAUTH_URL!,
};

