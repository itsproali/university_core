import { OfferedCourseClassSchedule } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { OfferedCourseClassScheduleService } from "./offeredCourseClassSchedule.service";

const createOfferedCourseClassSchedule = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseClassScheduleService.createOfferedCourseClassScheduleService(
      req.body
    );

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "OfferedCourse ClassSchedule created successfully",
    data: result,
  });
});

const getAllOfferedCourseClassSchedule = asyncHandler(async (req, res) => {
  const { data, meta } =
    await OfferedCourseClassScheduleService.getAllOfferedCourseClassScheduleService(
      req.queryParams
    );

  sendResponse<OfferedCourseClassSchedule[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse ClassSchedule retrieved successfully",
    meta,
    data,
  });
});

const getSingleOfferedCourseClassSchedule = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseClassScheduleService.getSingleOfferedCourseClassScheduleService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OfferedCourse ClassSchedule not found"
    );
  }

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered CourseClassSchedule retrieved successfully",
    data: result,
  });
});

const updateOfferedCourseClassSchedule = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseClassScheduleService.updateOfferedCourseClassScheduleService(
      req.params.id,
      req.body
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OfferedCourse ClassSchedule not found"
    );
  }

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse ClassSchedule updated successfully",
    data: result,
  });
});

const deleteOfferedCourseClassSchedule = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseClassScheduleService.deleteOfferedCourseClassScheduleService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OfferedCourse ClassSchedule not found"
    );
  }

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OfferedCourse ClassSchedule deleted successfully",
    data: result,
  });
});

export const OfferedCourseClassScheduleController = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedule,
  getSingleOfferedCourseClassSchedule,
  updateOfferedCourseClassSchedule,
  deleteOfferedCourseClassSchedule,
};
