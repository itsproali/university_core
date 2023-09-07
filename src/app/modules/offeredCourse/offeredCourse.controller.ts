import { OfferedCourse } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { OfferedCourseService } from "./offeredCourse.service";

const createOfferedCourse = asyncHandler(async (req, res) => {
  const result = await OfferedCourseService.createOfferedCourseService(
    req.body
  );

  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "OfferedCourse created successfully",
    data: result,
  });
});

const getAllOfferedCourse = asyncHandler(async (req, res) => {
  const { data, meta } = await OfferedCourseService.getAllOfferedCourseService(
    req.queryParams
  );

  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse retrieved successfully",
    meta,
    data,
  });
});

const getSingleOfferedCourse = asyncHandler(async (req, res) => {
  const result = await OfferedCourseService.getSingleOfferedCourseService(
    req.params.id
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "OfferedCourse not found");
  }

  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse retrieved successfully",
    data: result,
  });
});

const updateOfferedCourse = asyncHandler(async (req, res) => {
  const result = await OfferedCourseService.updateOfferedCourseService(
    req.params.id,
    req.body
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "OfferedCourse not found");
  }

  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse updated successfully",
    data: result,
  });
});

const deleteOfferedCourse = asyncHandler(async (req, res) => {
  const result = await OfferedCourseService.deleteOfferedCourseService(
    req.params.id
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "OfferedCourse not found");
  }

  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse deleted successfully",
    data: result,
  });
});

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
