import express from 'express';
import cors from 'cors';
import { EventController } from './controllers/event.controller';
import { initMetrics } from '@shared/utils';

const app = express();

app.use(cors());
app.use(express.json());
initMetrics('analytics-service', app);

app.post('/events', EventController.handleWebhook);
app.get('/kpis', EventController.getKPIs);
app.get('/trends', EventController.getTrends);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'analytics-service' });
});

export default app;
