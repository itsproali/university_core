import { AcademicDepartment } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { AcademicDepartmentService } from "./academicDepartment.service";

const createAcademicDepartment = asyncHandler(async (req, res) => {
  const result = await AcademicDepartmentService.createAcademicDepartment(
    req.body
  );

  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic Department created successfully",
    data: result,
  });
});

const getAllAcademicDepartment = asyncHandler(async (req, res) => {
  const { data, meta } =
    await AcademicDepartmentService.getAllAcademicDepartmentService(
      req.queryParams
    );
  sendResponse<AcademicDepartment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department retrieved successfully",
    meta,
    data,
  });
});

const getSingleAcademicDepartment = asyncHandler(async (req, res) => {
  const result =
    await AcademicDepartmentService.getSingleAcademicDepartmentService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "AcademicDepartment not found");
  }

  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department retrieved successfully",
    data: result,
  });
});

const updateAcademicDepartment = asyncHandler(async (req, res) => {
  const result =
    await AcademicDepartmentService.updateAcademicDepartmentService(
      req.params.id,
      req.body
    );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Academic Department not found");
  }

  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department updated successfully",
    data: result,
  });
});

const deleteAcademicDepartment = asyncHandler(async (req, res) => {
  const result =
    await AcademicDepartmentService.deleteAcademicDepartmentService(
      req.params.id
    );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Academic Department not found");
  }

  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department deleted successfully",
    data: result,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment,
};
