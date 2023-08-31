import { AcademicDepartment } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createAcademicDepartment = async (
  info: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data: info,
  });

  return result;
};

const getAllAcademicDepartmentService = async (
  options: Partial<IQueryParams>
) => {
  const query = getPrismaQuery(options, ["title"]);

  const result = await prisma.academicDepartment.findMany(query);
  const total = await prisma.academicDepartment.count();

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

const getSingleAcademicDepartmentService = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateAcademicDepartmentService = async (
  id: string,
  info: Partial<AcademicDepartment>
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteAcademicDepartmentService = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartmentService,
  getSingleAcademicDepartmentService,
  updateAcademicDepartmentService,
  deleteAcademicDepartmentService,
};
