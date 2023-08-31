import { Student } from "@prisma/client";
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

export const StudentController = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
