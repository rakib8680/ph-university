import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);
router.delete(
  '/:id',
  SemesterRegistrationController.deleteSemesterRegistration,
);

export const semesterRegistrationRoutes = router;
