import { Course, CourseFaculty } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { CourseService } from "./course.service";

const createCourse = asyncHandler(async (req, res) => {
  const result = await CourseService.createCourseService(req.body);

  sendResponse<Course>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourse = asyncHandler(async (req, res) => {
  const { data, meta } = await CourseService.getAllCourseService(
    req.queryParams
  );
  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrieved successfully",
    meta,
    data,
  });
});

const getSingleCourse = asyncHandler(async (req, res) => {
  const result = await CourseService.getSingleCourseService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});

const updateCourse = asyncHandler(async (req, res) => {
  const result = await CourseService.updateCourseService(
    req.params.id,
    req.body
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const result = await CourseService.deleteCourseService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

const assignFaculties = asyncHandler(async (req, res) => {
  const result = await CourseService.assignFacultiesService(
    req.params.id,
    req.body.faculties
  );

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculty assigned successfully",
    data: result,
  });
});

const removeFaculties = asyncHandler(async (req, res) => {
  const result = await CourseService.removeFacultiesService(
    req.params.id,
    req.body.faculties
  );

  if (!result.count) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to remove faculties");
  }

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculty removed successfully",
  });
});

export const CourseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties,
};
