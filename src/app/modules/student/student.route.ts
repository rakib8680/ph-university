import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { studentControllers } from './student.controller';
import { studentValidations } from './student.zod.validation';

const router = express.Router();

router.get('/', studentControllers.getAllStudents);
router.get('/:id', studentControllers.getSingleStudent);
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateStudent,
);
router.delete('/:id', studentControllers.deleteStudent);

export const studentRoutes = router;
