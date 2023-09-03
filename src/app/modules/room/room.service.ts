import { Room } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createRoomService = async (info: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data: info,
  });

  return result;
};

const getAllRoomService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, ["roomNumber", "floor"]);

  const result = await prisma.room.findMany(query);
  const total = await prisma.room.count();

  return {
    data: result,
    meta: {
      total,
      totalResult: result.length,
      totalPages: Math.ceil(total / (options.limit || 100)),
      currentPage: options.page || 1,
      limit: options.limit,
    },
  };
};

const getSingleRoomService = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateRoomService = async (
  id: string,
  info: Partial<Room>
): Promise<Room | null> => {
  const result = await prisma.room.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteRoomService = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.delete({
    where: {
      id,
    },
  });

  return result;
};

export const RoomService = {
  createRoomService,
  getAllRoomService,
  getSingleRoomService,
  updateRoomService,
  deleteRoomService,
};
