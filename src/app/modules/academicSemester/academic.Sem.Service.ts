import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TAcademicSemester } from './academic.Sem.Interface';
import { AcademicSemester } from './academic.Sem.Model';
import { academicSemesterNameCodeMapper } from './academicSem.constant';

// create Academic Semester
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code)
    throw new AppError(httpStatus.NOT_FOUND,'Invalid Semester Code');

  const result = await AcademicSemester.create(payload);
  return result;
};

// get all academic semester
const getAllAcademicSemester = async () => {
  const result = await AcademicSemester.find();
  return result;
};

// get single semester
const getSingleAcademicSemester = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

// update academic semester
const updateAcademicSemester = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND,'Invalid Semester Code');
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true, 
    runValidators: true
  });
  return result;
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
