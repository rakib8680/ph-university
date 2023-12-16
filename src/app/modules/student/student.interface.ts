/* eslint-disable no-unused-vars */
// create interface

import { Model, Types } from 'mongoose';

// username interface
export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

// student interface
export type Student = {
  id: string;
  user:Types.ObjectId;
  password:string;
  name: UserName;
  email: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  contactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian;
  profilePicture?: string;
  admissionSemester : Types.ObjectId;
  isDeleted?:boolean;
  academicDepartment: Types.ObjectId;
};

// guardian interface
export type Guardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation?: string;
  motherContactNo?: string;
};

// for creating custom instance methods in mongoose model
export interface StudentModelInterface extends Model<Student> {
  isUserExist(id: string): Promise<Student | null>;
}
