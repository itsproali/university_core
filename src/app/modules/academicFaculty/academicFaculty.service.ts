import { AcademicFaculty } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createAcademicFaculty = async (
  info: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data: info,
  });

  return result;
};

const getAllAcademicFacultyService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, ["title"]);

  const result = await prisma.academicFaculty.findMany(query);
  const total = await prisma.academicFaculty.count();

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

const getSingleAcademicFacultyService = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateAcademicFacultyService = async (
  id: string,
  info: Partial<AcademicFaculty>
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteAcademicFacultyService = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFacultyService,
  getSingleAcademicFacultyService,
  updateAcademicFacultyService,
  deleteAcademicFacultyService,
};
