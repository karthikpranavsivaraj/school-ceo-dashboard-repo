import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import { authenticate, authorize } from './middleware/auth.middleware';
import dotenv from 'dotenv';
import { initMetrics } from '@shared/utils';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
initMetrics('api-gateway', app);

// Public routes
app.use('/auth', proxy(process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001'));

// Protected routes with RBAC
app.use('/students', authenticate, proxy(process.env.STUDENT_SERVICE_URL || 'http://localhost:3002'));
app.use('/teachers', authenticate, proxy(process.env.TEACHER_SERVICE_URL || 'http://localhost:3003'));
app.use('/ceo', authenticate, authorize(['CEO', 'TECH_OWNER']), proxy(process.env.CEO_API_URL || 'http://localhost:3006'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'api-gateway' });
});

export default app;
