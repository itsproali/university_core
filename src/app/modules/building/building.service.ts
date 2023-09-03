import { Building } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createBuildingService = async (info: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: info,
  });

  return result;
};

const getAllBuildingService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, ["title"]);

  const result = await prisma.building.findMany(query);
  const total = await prisma.building.count();

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

const getSingleBuildingService = async (
  id: string
): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateBuildingService = async (
  id: string,
  info: Partial<Building>
): Promise<Building | null> => {
  const result = await prisma.building.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteBuildingService = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingService = {
  createBuildingService,
  getAllBuildingService,
  getSingleBuildingService,
  updateBuildingService,
  deleteBuildingService,
};
