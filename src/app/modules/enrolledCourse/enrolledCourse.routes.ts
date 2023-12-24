import express from 'express';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

export const EnrolledCourseRoutes = router;
