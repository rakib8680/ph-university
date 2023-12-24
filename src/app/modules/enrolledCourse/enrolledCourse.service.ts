import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { StudentModel } from '../student/student.model';
import EnrolledCourse from './enrolledCourse.model';
import mongoose from 'mongoose';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: Check if the offered courses is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  const { offeredCourse } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full !');
  }

  const student = await StudentModel.findOne({ id: userId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    offeredCourse,
    student: student._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student already enrolled !');
  }

  // start session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(httpStatus.BAD_GATEWAY, 'Failed to enroll !');
    }

    // Update the max capacity
    const newMaxCapacity = isOfferedCourseExists.maxCapacity - 1;
    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: newMaxCapacity,
      },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return error;
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
