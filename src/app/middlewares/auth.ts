import httpStatus from 'http-status';
import AppError from '../errors/appError';
import catchAsync from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import config from '../config';

// middleware for validating access token
const auth = () => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // if the token is sent from client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    // verify the token
    jwt.verify(token, config.jwt_access_secret as string, (err, decode) => {
      if (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
      }
      console.log(decode);
    });

    next();
  });
};

export default auth;
