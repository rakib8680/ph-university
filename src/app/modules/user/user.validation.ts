import { z } from 'zod';
import { UserStatus } from './user.constant';
const UserValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .max(20, { message: 'Password must be less than 20 characters' }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const userValidations = {
  UserValidationSchema,
  changeStatusValidationSchema,
};
