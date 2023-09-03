import { Room } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { RoomService } from "./room.service";

const createRoom = asyncHandler(async (req, res) => {
  const result = await RoomService.createRoomService(req.body);

  sendResponse<Room>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Room created successfully",
    data: result,
  });
});

const getAllRoom = asyncHandler(async (req, res) => {
  const { data, meta } = await RoomService.getAllRoomService(req.queryParams);
  sendResponse<Room[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room retrieved successfully",
    meta,
    data,
  });
});

const getSingleRoom = asyncHandler(async (req, res) => {
  const result = await RoomService.getSingleRoomService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Room not found");
  }

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room retrieved successfully",
    data: result,
  });
});

const updateRoom = asyncHandler(async (req, res) => {
  const result = await RoomService.updateRoomService(req.params.id, req.body);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Room not found");
  }

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room updated successfully",
    data: result,
  });
});

const deleteRoom = asyncHandler(async (req, res) => {
  const result = await RoomService.deleteRoomService(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Room not found");
  }

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room deleted successfully",
    data: result,
  });
});

export const RoomController = {
  createRoom,
  getAllRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
