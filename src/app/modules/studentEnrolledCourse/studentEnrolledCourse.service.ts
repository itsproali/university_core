import { StudentEnrolledCourse } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const getAllStudentEnrolledCourseService = async (
  options: Partial<IQueryParams>
) => {
  const query = getPrismaQuery(options, [
    "grade",
    "point",
    "totalMarks",
    "status",
  ]);

  const result = await prisma.studentEnrolledCourse.findMany(query);
  const total = await prisma.studentEnrolledCourse.count();

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

const getSingleStudentEnrolledCourseService = async (
  id: string
): Promise<StudentEnrolledCourse | null> => {
  const result = await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateStudentEnrolledCourseService = async (
  id: string,
  payload: Partial<StudentEnrolledCourse>
): Promise<StudentEnrolledCourse | null> => {
  const result = await prisma.studentEnrolledCourse.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteStudentEnrolledCourseService = async (
  id: string
): Promise<StudentEnrolledCourse | null> => {
  const result = await prisma.studentEnrolledCourse.delete({
    where: {
      id,
    },
  });

  return result;
};

export const StudentEnrolledCourseService = {
  getAllStudentEnrolledCourseService,
  getSingleStudentEnrolledCourseService,
  updateStudentEnrolledCourseService,
  deleteStudentEnrolledCourseService,
};
