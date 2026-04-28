import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { initMetrics } from '@shared/utils';

const app = express();

app.use(cors());
app.use(express.json());

initMetrics('identity-service', app);

app.use('/', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'identity-service' });
});

export default app;
