import { StudentEnrolledCourse } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { StudentEnrolledCourseService } from "./studentEnrolledCourse.service";

const getAllStudentEnrolledCourse = asyncHandler(async (req, res) => {
  const { data, meta } =
    await StudentEnrolledCourseService.getAllStudentEnrolledCourseService(
      req.queryParams
    );
  sendResponse<StudentEnrolledCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Enrolled Course retrieved successfully",
    meta,
    data,
  });
});

const getSingleStudentEnrolledCourse = asyncHandler(async (req, res) => {
  const result =
    await StudentEnrolledCourseService.getSingleStudentEnrolledCourseService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Student Enrolled Course not found"
    );
  }

  sendResponse<StudentEnrolledCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Enrolled Course retrieved successfully",
    data: result,
  });
});

const updateStudentEnrolledCourse = asyncHandler(async (req, res) => {
  const result =
    await StudentEnrolledCourseService.updateStudentEnrolledCourseService(
      req.params.id,
      req.body
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Student Enrolled Course not found"
    );
  }

  sendResponse<StudentEnrolledCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Enrolled Course updated successfully",
    data: result,
  });
});

const deleteStudentEnrolledCourse = asyncHandler(async (req, res) => {
  const result =
    await StudentEnrolledCourseService.deleteStudentEnrolledCourseService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Student Enrolled Course not found"
    );
  }

  sendResponse<StudentEnrolledCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Enrolled Course deleted successfully",
    data: result,
  });
});

export const StudentEnrolledCourseController = {
  getAllStudentEnrolledCourse,
  getSingleStudentEnrolledCourse,
  updateStudentEnrolledCourse,
  deleteStudentEnrolledCourse,
};
