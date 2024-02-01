import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../admin/admin.validation';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { studentValidations } from '../student/student.zod.validation';
import { userControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userValidations } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

// create student
router.post(
  '/create-student',

  auth(USER_ROLE.admin, USER_ROLE.superAdmin),

  upload.single('file'),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },

  validateRequest(studentValidations.CreateStudentValidationSchema),

  userControllers.createStudent,
);

// create faculty
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),

  upload.single('file'),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createFacultyValidationSchema),
  userControllers.createFaculty,
);

// create admin
router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin ),
  upload.single('file'),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  userControllers.createAdmin,
);

// get myself route
router.get(
  '/me',
  auth(
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
    USER_ROLE.superAdmin,
  ),
  userControllers.getMe,
);

// change status

router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidations.changeStatusValidationSchema),
  userControllers.changeStatus,
);

export const userRoutes = router;
