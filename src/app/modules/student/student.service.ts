import { Student } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createStudentService = async (info: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: info,
  });

  return result;
};

const getAllStudentService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, [
    "firstName",
    "lastName",
    "email",
    "contactNo",
    "gender",
    "bloodGroup",
    "designation",
  ]);

  const result = await prisma.student.findMany(query);
  const total = await prisma.student.count();

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

const getSingleStudentService = async (
  studentId: string
): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      studentId,
    },
  });

  return result;
};

const updateStudentService = async (
  id: string,
  info: Partial<Student>
): Promise<Student | null> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteStudentService = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
  });

  return result;
};

export const StudentService = {
  createStudentService,
  getAllStudentService,
  getSingleStudentService,
  updateStudentService,
  deleteStudentService,
};
