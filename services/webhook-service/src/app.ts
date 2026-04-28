import express from 'express';
import cors from 'cors';
import { WebhookController } from './controllers/webhook.controller';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/emit', WebhookController.emitEvent);
app.post('/subscribe', WebhookController.subscribe);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'webhook-service' });
});

export default app;
