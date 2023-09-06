import { CourseFaculty, Faculty } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { FacultyService } from "./faculty.service";

const createFaculty = asyncHandler(async (req, res) => {
  const result = await FacultyService.createFacultyService(req.body);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Faculty created successfully",
    data: result,
  });
});

const getAllFaculty = asyncHandler(async (req, res) => {
  const { data, meta } = await FacultyService.getAllFacultyService(
    req.queryParams
  );
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculty retrieved successfully",
    meta,
    data,
  });
});

const getSingleFaculty = asyncHandler(async (req, res) => {
  const result = await FacultyService.getSingleFacultyService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculty retrieved successfully",
    data: result,
  });
});

const updateFaculty = asyncHandler(async (req, res) => {
  const result = await FacultyService.updateFacultyService(
    req.params.id,
    req.body
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculty updated successfully",
    data: result,
  });
});

const deleteFaculty = asyncHandler(async (req, res) => {
  const result = await FacultyService.deleteFacultyService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculty deleted successfully",
    data: result,
  });
});

const assignCourses = asyncHandler(async (req, res) => {
  const result = await FacultyService.assignCoursesService(
    req.params.id,
    req.body.courses
  );

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course faculty assigned successfully",
    data: result,
  });
});

const removeCourses = asyncHandler(async (req, res) => {
  const result = await FacultyService.removeCoursesService(
    req.params.id,
    req.body.courses
  );

  if (!result.count) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to remove course faculty"
    );
  }

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course removed successfully",
  });
});

export const FacultyController = {
  createFaculty,
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
};
