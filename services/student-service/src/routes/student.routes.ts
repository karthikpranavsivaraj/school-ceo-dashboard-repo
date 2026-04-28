import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router = Router();

router.get('/', StudentController.getAllStudents);
router.get('/:id', StudentController.getStudentById);
router.post('/', StudentController.createStudent);
router.patch('/:id/marks', StudentController.updateMarks);

export default router;
