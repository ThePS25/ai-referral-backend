import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './utils/database';
import { logCorsConfig } from './utils/cors';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    logCorsConfig();
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
