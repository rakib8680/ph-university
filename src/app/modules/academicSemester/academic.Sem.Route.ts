import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterControllers } from './academic.Sem.Controller';
import {
  createAcademicSemValidationSchema,
  updateAcademicSemValidationSchema,
} from './academic.Sem.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicSemesterControllers.getAllAcademicSemester,
);
router.post(
  '/create-academic-semester',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createAcademicSemValidationSchema),
  academicSemesterControllers.createAcademicSemester,
);
router.get(
  '/:semesterId',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicSemesterControllers.getSingleSemester,
);

router.patch(
  '/:semesterId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateAcademicSemValidationSchema),
  academicSemesterControllers.updateAcademicSemester,
);

export const academicSemesterRoutes = router;
