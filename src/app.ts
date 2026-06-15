import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import referralRoutes from './routes/referralRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/referral', referralRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
