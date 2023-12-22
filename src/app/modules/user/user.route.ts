import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../admin/admin.validation';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { studentValidations } from '../student/student.zod.validation';
import { userControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// create student
router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidations.CreateStudentValidationSchema),
  userControllers.createStudent,
);

// create faculty
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  userControllers.createFaculty,
);

// create admin
router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  userControllers.createAdmin,
);

// get myself route
router.get('/me', auth('student', 'faculty', 'admin'), userControllers.getMe);

export const userRoutes = router;
