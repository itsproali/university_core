import { Faculty } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createFacultyService = async (info: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: info,
  });

  return result;
};

const getAllFacultyService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, [
    "firstName",
    "lastName",
    "email",
    "contactNo",
    "gender",
    "bloodGroup",
    "designation",
  ]);

  const result = await prisma.faculty.findMany(query);
  const total = await prisma.faculty.count();

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

const getSingleFacultyService = async (
  facultyId: string
): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      facultyId,
    },
  });

  return result;
};

const updateFacultyService = async (
  id: string,
  info: Partial<Faculty>
): Promise<Faculty | null> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteFacultyService = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FacultyService = {
  createFacultyService,
  getAllFacultyService,
  getSingleFacultyService,
  updateFacultyService,
  deleteFacultyService,
};
