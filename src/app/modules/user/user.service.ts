/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import { Student } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { StudentModel } from '../student/student.model';
import { AcademicSemester } from '../academicSemester/academic.Sem.Model';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { Admin } from '../admin/admin.model';




// create student 
const createStudentIntoDB = async (password: string, payload: Student) => {
  const userData: Partial<TUser> = {};

  // set user password and role
  userData.password = password || (config.default_password as string);
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  // start session
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // set user id
    userData.id = await generateStudentId(admissionSemester!);

    // create a user - transaction-1
    const newUser = await User.create([userData], { session });

    // check if user created or not
    if (!newUser.length)
      throw new AppError(httpStatus.BAD_REQUEST, 'User not created');

    payload.id = newUser[0].id; //embedded id
    payload.user = newUser[0]._id; //reference id

    //   create a student - transaction-2
    const newStudent = await StudentModel.create([payload], { session });

    // check if student created or not
    if (!newStudent.length)
      throw new AppError(httpStatus.BAD_REQUEST, 'Student not created');

    await session.commitTransaction();
    await session.endSession();

    return newStudent;

    
  } catch (error : any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};



// create faculty 
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};



// create admin 
const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); 

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};




export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB
};
