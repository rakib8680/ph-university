import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterServices } from './academic.Sem.Service';



// create student
const createAcademicSemester = catchAsync(async (req, res) => {
  const data = req.body;

  const result =
    await academicSemesterServices.createAcademicSemesterIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester  created successfully',
    data: result,
  });
});



// get all academic semester
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemester();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Semester  fetched successfully',
    data: result,
  });
});


// get single semester 
const getSingleSemester = catchAsync(async(req,res)=>{

    const {semesterId} = req.params;

    const result = await academicSemesterServices.getSingleAcademicSemester(semesterId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semester  fetched successfully',
        data: result,
      });

})


// update semester 
const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result = await academicSemesterServices.updateAcademicSemester(
      semesterId,
      req.body,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester updated successfully',
      data: result,
    });
  });


export const academicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
    getSingleSemester,
    updateAcademicSemester
};
