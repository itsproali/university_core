import { OfferedCourseSection } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { OfferedCourseSectionService } from "./offeredCourseSection.service";

const createOfferedCourseSection = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseSectionService.createOfferedCourseSectionService(
      req.body
    );

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Offered Course Section created successfully",
    data: result,
  });
});

const getAllOfferedCourseSection = asyncHandler(async (req, res) => {
  const { data, meta } =
    await OfferedCourseSectionService.getAllOfferedCourseSectionService(
      req.queryParams
    );
  sendResponse<OfferedCourseSection[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course Section retrieved successfully",
    meta,
    data,
  });
});

const getSingleOfferedCourseSection = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseSectionService.getSingleOfferedCourseSectionService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Offered Course Section not found"
    );
  }

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course Section retrieved successfully",
    data: result,
  });
});

const updateOfferedCourseSection = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseSectionService.updateOfferedCourseSectionService(
      req.params.id,
      req.body
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Offered Course Section not found"
    );
  }

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course Section updated successfully",
    data: result,
  });
});

const deleteOfferedCourseSection = asyncHandler(async (req, res) => {
  const result =
    await OfferedCourseSectionService.deleteOfferedCourseSectionService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Offered Course Section not found"
    );
  }

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course Section deleted successfully",
    data: result,
  });
});

export const OfferedCourseSectionController = {
  createOfferedCourseSection,
  getAllOfferedCourseSection,
  getSingleOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
