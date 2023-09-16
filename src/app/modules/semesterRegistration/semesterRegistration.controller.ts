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

const startRegistration = asyncHandler(async (req, res) => {
  const id = req?.user?.userId;
  const result =
    await SemesterRegistrationService.startSemesterRegistrationService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration started successfully",
    data: result,
  });
});

const enrollIntoCourse = asyncHandler(async (req, res) => {
  const id = req?.user?.userId;
  const result = await SemesterRegistrationService.enrollIntoCourseService(
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully enrolled into course",
    data: result,
  });
});

const withdrawFromCourse = asyncHandler(async (req, res) => {
  const id = req?.user?.userId;
  const result = await SemesterRegistrationService.withdrawFromCourseService(
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully withdraw from course",
    data: result,
  });
});

const confirmRegistration = asyncHandler(async (req, res) => {
  const id = req?.user?.userId;
  const result = await SemesterRegistrationService.confirmRegistrationService(
    id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration confirmed successfully",
    data: result,
  });
});

const getStudentRegistration = asyncHandler(async (req, res) => {
  const id = req?.user?.userId;
  const result =
    await SemesterRegistrationService.getStudentRegistrationService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester Registration retrieved successfully",
    data: result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  startRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmRegistration,
  getStudentRegistration,
};
