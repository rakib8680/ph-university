import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';

// create course
const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

// get all courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

    const result = await courseQuery.modelQuery;
    const meta = await courseQuery.countTotal();
  return {
    meta,
    result,
  };
};

// get single course
const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

// update course
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingData } = payload;

  // start session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      remainingData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    // check  preRequisiteCourses add and delete
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // delete preRequisiteCourses
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: {
                $in: deletedPreRequisites,
              },
            },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      // add new preRequisiteCourses
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: {
              $each: newPreRequisites,
            },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      // final result
      const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
      );

      return result;
    }

    session.commitTransaction();
    session.endSession();
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

// delete course
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return result;
};

// assign faculties
const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: {
        faculties: {
          $each: payload,
        },
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  return result;
};

// remove faculties
const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $pull: {
        faculties: {
          $in: payload,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
