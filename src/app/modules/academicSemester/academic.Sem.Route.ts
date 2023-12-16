import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterControllers } from './academic.Sem.Controller';
import {
  createAcademicSemValidationSchema,
  updateAcademicSemValidationSchema,
} from './academic.Sem.validation';

const router = express.Router();

router.get('/', academicSemesterControllers.getAllAcademicSemester);
router.post(
  '/create-academic-semester',
  validateRequest(createAcademicSemValidationSchema),
  academicSemesterControllers.createAcademicSemester,
);
router.get('/:semesterId', academicSemesterControllers.getSingleSemester);
router.patch(
  '/:semesterId',
  validateRequest(updateAcademicSemValidationSchema),
  academicSemesterControllers.updateAcademicSemester,
);

export const academicSemesterRoutes = router;
