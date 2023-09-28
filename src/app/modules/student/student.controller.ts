import { Student, StudentEnrolledCourse } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { StudentService } from "./student.service";

const createStudent = asyncHandler(async (req, res) => {
  const result = await StudentService.createStudentService(req.body);

  sendResponse<Student>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

const getAllStudent = asyncHandler(async (req, res) => {
  const { data, meta } = await StudentService.getAllStudentService(
    req.queryParams
  );
  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student retrieved successfully",
    meta,
    data,
  });
});

const getSingleStudent = asyncHandler(async (req, res) => {
  const result = await StudentService.getSingleStudentService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
  }

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student retrieved successfully",
    data: result,
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const result = await StudentService.updateStudentService(
    req.params.id,
    req.body
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
  }

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const result = await StudentService.deleteStudentService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
  }

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});

const getStudentCourses = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const result = await StudentService.getStudentCoursesService(userId);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
  }

  sendResponse<StudentEnrolledCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Courses retrieved successfully",
    data: result,
  });
});

const getStudentCourseSchedules = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const result = await StudentService.getStudentCourseScheduleService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course Schedules retrieved successfully",
    data: result,
  });
});

const getAcademicInfo = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const result = await StudentService.getAcademicInfoService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic info retrieved successfully",
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  getStudentCourses,
  getStudentCourseSchedules,
  getAcademicInfo,
};
