import { Building } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { BuildingService } from "./building.service";

const createBuilding = asyncHandler(async (req, res) => {
  const result = await BuildingService.createBuildingService(req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Building created successfully",
    data: result,
  });
});

const getAllBuilding = asyncHandler(async (req, res) => {
  const { data, meta } = await BuildingService.getAllBuildingService(
    req.queryParams
  );
  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Building retrieved successfully",
    meta,
    data,
  });
});

const getSingleBuilding = asyncHandler(async (req, res) => {
  const result = await BuildingService.getSingleBuildingService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Building not found");
  }

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Building retrieved successfully",
    data: result,
  });
});

const updateBuilding = asyncHandler(async (req, res) => {
  const result = await BuildingService.updateBuildingService(
    req.params.id,
    req.body
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Building not found");
  }

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Building updated successfully",
    data: result,
  });
});

const deleteBuilding = asyncHandler(async (req, res) => {
  const result = await BuildingService.deleteBuildingService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Building not found");
  }

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Building deleted successfully",
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
  getAllBuilding,
  getSingleBuilding,
  updateBuilding,
  deleteBuilding,
};
