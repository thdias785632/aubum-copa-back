import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './infra/http/routes';
import { container } from './app/database-injection/injection';
import { IDatabaseConnection } from './app/@shared/database/database.interface';

dotenv.config();

console.log('Starting AUbum da Copa server...');
console.log('ENV:', process.env.ENV);
console.log('PORT:', process.env.PORT);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.get('/', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'AUbum da Copa API is running on /api' });
});

app.get('/health', async (_req: express.Request, res: express.Response) => {
  try {
    const dbService = container.get<IDatabaseConnection>('IDatabaseConnection');
    const client = dbService.connect();
    await client.connect();
    await client.end();
    res.json({ status: 'OK', db: 'connected' });
  } catch (error: any) {
    console.error('Health check failed:', error);
    res
      .status(500)
      .json({ status: 'ERROR', db: 'disconnected', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`AUbum da Copa server up on port ${PORT}`);
});
