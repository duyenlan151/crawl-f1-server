import { config } from 'dotenv';

config();

export const env = {
  PORT: process.env.PORT || 3000,
  WS_PORT: process.env.WS_PORT || 8080,
  F1_BASE_URL: process.env.F1_BASE_URL || 'https://www.formula1.com/en/results',
};