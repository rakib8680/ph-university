import { z } from 'zod';

// Zod schema for UserName
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20, { message: 'FirstName cannot be more that 20 characters' }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1)
    .max(20, { message: 'FirstName cannot be more that 20 characters' }),
});
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20, { message: 'FirstName cannot be more that 20 characters' })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1)
    .max(20, { message: 'FirstName cannot be more that 20 characters' })
    .optional(),
});

// Zod schema for Guardian
const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});
const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

// Zod schema for Student
const CreateStudentValidationSchema = z.object({
  body: z.object({
    password: z.string(),
    student: z.object({
      name: userNameValidationSchema,
      email: z.string().email(),
      dateOfBirth: z.string().optional(),
      gender: z.enum(['male', 'female']),
      contactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema,
      admissionSemester: z.string(),
      profilePicture: z.string().optional(),
      academicDepartment: z.string(),
    }),
  }),


});
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
      email: z.string().email().optional(),
      dateOfBirth: z.string().optional(),
      gender: z.enum(['male', 'female']).optional(),
      contactNo: z.string().optional(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      profilePicture: z.string().optional().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
 CreateStudentValidationSchema,
  updateStudentValidationSchema,
};
