import { Router } from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { academicSemesterRoutes } from '../modules/academicSemester/academic.Sem.Route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { CourseRoutes } from '../modules/course/course.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { studentRoutes } from '../modules/student/student.route';
import { userRoutes } from '../modules/user/user.route';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.routes';
import { offeredCourseRoutes } from '../modules/offeredCourse/offeredCourse.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { EnrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/enrolled-courses',
    route: EnrolledCourseRoutes,
  },
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
