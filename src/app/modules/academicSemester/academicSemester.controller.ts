import { AcademicSemester } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemesterService } from "./academicSemester.service";

const createAcademicSemester = asyncHandler(async (req, res) => {
  const result = await AcademicSemesterService.createAcademicSemester(req.body);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "AcademicSemester created successfully",
    data: result,
  });
});

const getAllAcademicSemester = asyncHandler(async (req, res) => {
  const { data, meta } =
    await AcademicSemesterService.getAllAcademicSemesterService(
      req.queryParams
    );
  sendResponse<AcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AcademicSemester retrieved successfully",
    meta,
    data,
  });
});

const getSingleAcademicSemester = asyncHandler(async (req, res) => {
  const result = await AcademicSemesterService.getSingleAcademicSemesterService(
    req.params.id
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "AcademicSemester not found");
  }

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AcademicSemester retrieved successfully",
    data: result,
  });
});

const updateAcademicSemester = asyncHandler(async (req, res) => {
  const result = await AcademicSemesterService.updateAcademicSemesterService(
    req.params.id,
    req.body
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "AcademicSemester not found");
  }

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Semester updated successfully",
    data: result,
  });
});

const deleteAcademicSemester = asyncHandler(async (req, res) => {
  const result = await AcademicSemesterService.deleteAcademicSemesterService(
    req.params.id
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Academic Semester not found");
  }

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Semester deleted successfully",
    data: result,
  });
});

export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
  deleteAcademicSemester,
};
