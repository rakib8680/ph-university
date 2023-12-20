import httpStatus from 'http-status';
import AppError from '../errors/appError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

// middleware for validating access token
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // if the token is sent from client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    // verify the token
    jwt.verify(token, config.jwt_access_secret as string, (err, decoded) => {
      if (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
      }

      const role = (decoded as JwtPayload).role;
      // if the user role is not matched
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
      }

      // set the user in req object
      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;
