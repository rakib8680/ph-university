import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

// middleware for validating data
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    // validate data here
    await schema.partial().parseAsync({ body: req.body, cookies: req.cookies });

    next(); 
  });
};

export default validateRequest;
