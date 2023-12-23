import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user.service';

// create student
const createStudent = catchAsync(async (req, res) => {



  const { password, student: studentData } = req.body;
  const result = await userServices.createStudentIntoDB(req.file,password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

// create Faculty
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await userServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

// create admin
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await userServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

// get me
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await userServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

// change status 
const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await userServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully',
    data: result,
  });
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
