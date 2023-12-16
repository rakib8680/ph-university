import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";




// middleware for validating data
const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // validate data here
        await schema.partial().parseAsync({ body: req.body });
  
         next();
      } catch (error) {
        next(error);
      }
    };
  };

  
  export default validateRequest;