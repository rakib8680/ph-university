import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password !');
  }

  // create jwt token and sent to client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  // create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '1d',
  );
  // create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    '30d',
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password !');
  }

  // hash the new password  
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // updating the password
  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  // checking if the jwt is issued before password changed
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  // create jwt token and sent to client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  // create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '1d',
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  // create jwt token and sent to client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  // create access token
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetPasswordLink = `${config.reset_password_link}?id=${user.id}&token=${resetToken}}`;

  sendEmail(user?.email, resetPasswordLink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isUserDeleted = user.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  // check if the token is valid
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  // check if the payload id and decoded id is same
  if (payload.id !== decoded.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  // hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // updating the password
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
