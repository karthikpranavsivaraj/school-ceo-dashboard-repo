import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';
import { initMetrics } from '@shared/utils';

const app = express();

app.use(cors());
app.use(express.json());
initMetrics('student-service', app);

app.use('/', studentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'student-service' });
});

export default app;
