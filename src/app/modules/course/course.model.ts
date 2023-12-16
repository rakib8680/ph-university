import { model, Schema } from "mongoose";
import { TCourse, TCourseFaculty, TPreRequisiteCourses } from "./course.interface";





  
  const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  });
  
  // course schema 
  const courseSchema = new Schema<TCourse>({
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    prefix: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      trim: true,
      required: true,
    },
    credits: {
      type: Number,
      trim: true,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  });


  // assign faculties schema 
  const courseFacultySchema = new Schema<TCourseFaculty>({
    course : {type: Schema.Types.ObjectId, ref: 'Course', unique: true},
    faculties: [
      {type: Schema.Types.ObjectId, ref: 'Faculty'}
    ]
  });
  

  // course model 
  export const Course = model<TCourse>('Course', courseSchema);

  // course faculty model
  export const CourseFaculty = model<TCourseFaculty>('CourseFaculty', courseFacultySchema);