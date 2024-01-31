import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { studentControllers } from './student.controller';
import { studentValidations } from './student.zod.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  studentControllers.getAllStudents,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  studentControllers.getSingleStudent,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateStudent,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  studentControllers.deleteStudent,
);

export const studentRoutes = router;
