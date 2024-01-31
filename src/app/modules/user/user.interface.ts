/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  email:string;
  password: string;
  passwordChangedAt?: Date;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty' | 'superAdmin';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface userModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTime: Date,
    jwtIssuedTime: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
