import { SemesterRegistration } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { SemesterRegistrationService } from "./semesterRegistration.service";

const createSemesterRegistration = asyncHandler(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationService(
      req.body
    );

  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Semester Registration created successfully",
    data: result,
  });
});

const getAllSemesterRegistration = asyncHandler(async (req, res) => {
  const { data, meta } =
    await SemesterRegistrationService.getAllSemesterRegistrationService(
      req.queryParams
    );
  sendResponse<SemesterRegistration[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration retrieved successfully",
    meta,
    data,
  });
});

const getSingleSemesterRegistration = asyncHandler(async (req, res) => {
  const result =
    await SemesterRegistrationService.getSingleSemesterRegistrationService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Semester Registration not found");
  }

  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration retrieved successfully",
    data: result,
  });
});

const updateSemesterRegistration = asyncHandler(async (req, res) => {
  const result =
    await SemesterRegistrationService.updateSemesterRegistrationService(
      req.params.id,
      req.body
    );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Semester Registration not found");
  }

  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration updated successfully",
    data: result,
  });
});

const deleteSemesterRegistration = asyncHandler(async (req, res) => {
  const result =
    await SemesterRegistrationService.deleteSemesterRegistrationService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Semester Registration not found");
  }

  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SemesterRegistration deleted successfully",
    data: result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
