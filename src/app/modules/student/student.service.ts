import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { studentSearchableFields } from './student.constant';
import { Student } from './student.interface';
import { StudentModel } from './student.model';

// raw code for filtering , sorting and pagination, search etc
{
  // const queryObject = { ...query };
  // let searchTerm = '';
  // const studentSearchableFields = [
  //   'email',
  //   'name.firstName',
  //   'name.lastName',
  //   'presentAddress',
  // ];
  // if (query?.searchTerm) {
  //   searchTerm = query.searchTerm as string;
  // }
  // // search partial
  // const searchQuery = StudentModel.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // // filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach(el =>delete queryObject[el])
  // const filterQuery = searchQuery
  //   .find(queryObject)
  // .populate('admissionSemester')
  // .populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty',
  //   },
  // });
  // sorting
  // let sort = '-createdAt';
  // if(query.sort){
  //   sort = query.sort as string;
  // };
  // const sortQuery = filterQuery.sort(sort);
  // limiting & pagination
  // let limit = 1;
  // let page = 1;
  // let skip = 0;
  // if(query.limit){
  //   limit = query.limit as number;
  // };
  // if(query.page){
  //   page = query.page as number;
  //   skip = (page - 1) * limit;
  // };
  // const paginateQuery = sortQuery.skip(skip)
  // const limitQuery = paginateQuery.limit(limit);
  // field limiting
  // let fields = '';
  // if(query.fields){
  //   fields = (query.fields as string).split(',').join(' ');
  // };
  // const fieldQuery = await limitQuery.select(fields);
  // return fieldQuery;
}

// get all student
const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;

  return result;
};



// get single student
const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};



// update student
const updateStudentIntoDB = async (id: string, payload: Partial<Student>) => {
  const { name, guardian, ...remaining } = payload;

  const modifiedData: Record<string, unknown> = { ...remaining };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${key}`] = value;
    }
  }

  const result = await StudentModel.findByIdAndUpdate(id, modifiedData);

  return result;
};



// delete student/user
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete student
    const deletedStudent = await StudentModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent){
      throw new AppError(httpStatus.BAD_REQUEST, 'Student not deleted');
    };

    // get user _id from deleted student 
    const userId = deletedStudent.user 

    // DELETE user
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser)
      throw new AppError(httpStatus.BAD_REQUEST, 'User not deleted');

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};



export const studentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
