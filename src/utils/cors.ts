import { CorsOptions } from 'cors';

const normalizeOrigin = (origin: string): string => origin.trim().replace(/\/$/, '');

export const getAllowedOrigins = (): string[] => {
  const defaults = ['http://localhost:5173', 'http://localhost:5174'];
  const fromEnv = process.env.CORS_ORIGIN;

  if (!fromEnv) {
    return defaults;
  }

  const origins = fromEnv
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

  return [...new Set([...origins, ...defaults])];
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();

    // Server-to-server, curl, or same-origin requests
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalized = normalizeOrigin(origin);

    if (allowed.includes(normalized)) {
      callback(null, true);
      return;
    }

    console.warn(`CORS blocked request from origin: ${origin}`);
    console.warn(`Allowed origins: ${allowed.join(', ')}`);
    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 204,
};

export const logCorsConfig = (): void => {
  const origins = getAllowedOrigins();
  console.log(`CORS allowed origins: ${origins.join(', ')}`);
};
