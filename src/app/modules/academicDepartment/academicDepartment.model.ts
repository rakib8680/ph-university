import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import AppError from '../../errors/appError';
import { TAcademicDepartment } from './academicDepartment.interface';



const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);





// check if department already exist or not
// academicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicDepartment.findOne({
//     name: this.name,
//   });


//   if (isDepartmentExist) {
//     throw new AppError(httpStatus.NOT_FOUND,'Department already exist');
//   }


//   next();
// });




// check department exist or not before update
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isDepartmentExist = await AcademicDepartment.findOne(query);

  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND,'Department does not exist');
  }
  
  next();

});





export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
