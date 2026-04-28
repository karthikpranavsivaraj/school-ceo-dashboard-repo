import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';

const router = Router();

router.post('/upload-marks', TeacherController.uploadMarks);
router.get('/classes', TeacherController.getClasses);

export default router;
