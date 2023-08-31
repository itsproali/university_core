import { AcademicFaculty } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { AcademicFacultyService } from "./academicFaculty.service";

const createAcademicFaculty = asyncHandler(async (req, res) => {
  const result = await AcademicFacultyService.createAcademicFaculty(req.body);

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic Faculty created successfully",
    data: result,
  });
});

const getAllAcademicFaculty = asyncHandler(async (req, res) => {
  const { data, meta } =
    await AcademicFacultyService.getAllAcademicFacultyService(req.queryParams);
  sendResponse<AcademicFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculty retrieved successfully",
    meta,
    data,
  });
});

const getSingleAcademicFaculty = asyncHandler(async (req, res) => {
  const result = await AcademicFacultyService.getSingleAcademicFacultyService(
    req.params.id
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "AcademicFaculty not found");
  }

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculty retrieved successfully",
    data: result,
  });
});

const updateAcademicFaculty = asyncHandler(async (req, res) => {
  const result = await AcademicFacultyService.updateAcademicFacultyService(
    req.params.id,
    req.body
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Academic Faculty not found");
  }

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculty updated successfully",
    data: result,
  });
});

const deleteAcademicFaculty = asyncHandler(async (req, res) => {
  const result = await AcademicFacultyService.deleteAcademicFacultyService(
    req.params.id
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Academic Faculty not found");
  }

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculty deleted successfully",
    data: result,
  });
});

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
