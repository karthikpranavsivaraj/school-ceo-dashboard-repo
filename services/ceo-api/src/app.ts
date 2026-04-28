import express from 'express';
import cors from 'cors';
import { DashboardController } from './controllers/dashboard.controller';
import { initMetrics } from '@shared/utils';

const app = express();

app.use(cors());
app.use(express.json());
initMetrics('ceo-api', app);

app.get('/summary', DashboardController.getSummary);
app.get('/insights', DashboardController.getPerformanceInsights);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'ceo-api' });
});

export default app;
