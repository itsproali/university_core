import { AcademicSemester } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import { semesterTitleCodeMap } from "./academicSemester.utils";

const createAcademicSemester = async (
  info: AcademicSemester
): Promise<AcademicSemester> => {
  if (semesterTitleCodeMap[info.title] !== info.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid semester code");
  }

  const result = await prisma.academicSemester.create({
    data: info,
  });

  return result;
};

const getAllAcademicSemesterService = async (
  options: Partial<IQueryParams>
) => {
  const query = getPrismaQuery(options, ["title", "code", "year"]);

  const result = await prisma.academicSemester.findMany(query);
  const total = await prisma.academicSemester.count();

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

const getSingleAcademicSemesterService = async (
  id: string
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateAcademicSemesterService = async (
  id: string,
  info: Partial<AcademicSemester>
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteAcademicSemesterService = async (
  id: string
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AcademicSemesterService = {
  createAcademicSemester,
  getAllAcademicSemesterService,
  getSingleAcademicSemesterService,
  updateAcademicSemesterService,
  deleteAcademicSemesterService,
};
