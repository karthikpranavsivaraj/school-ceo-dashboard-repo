import express from 'express';
import cors from 'cors';
import teacherRoutes from './routes/teacher.routes';
import { initMetrics } from '@shared/utils';

const app = express();

app.use(cors());
app.use(express.json());
initMetrics('teacher-service', app);

app.use('/', teacherRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'teacher-service' });
});

export default app;
