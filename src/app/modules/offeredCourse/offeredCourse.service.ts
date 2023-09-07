import { OfferedCourse } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import { IOfferedCourseBody } from "./offeredCourse.interface";

const createOfferedCourseService = async (
  payload: IOfferedCourseBody
): Promise<OfferedCourse[] | null> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = payload;

  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });

    if (!alreadyExist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          academicDepartment: true,
          semesterRegistration: true,
          course: true,
        },
      });

      result.push(insertOfferedCourse);
    }
  });

  return result;
};

const getAllOfferedCourseService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, ["id"]);

  const result = await prisma.offeredCourse.findMany(query);
  const total = await prisma.offeredCourse.count();

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

const getSingleOfferedCourseService = async (
  id: string
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  return result;
};

const updateOfferedCourseService = async (
  id: string,
  info: Partial<OfferedCourse>
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteOfferedCourseService = async (
  id: string
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.delete({
    where: {
      id,
    },
  });

  return result;
};

export const OfferedCourseService = {
  createOfferedCourseService,
  getAllOfferedCourseService,
  getSingleOfferedCourseService,
  updateOfferedCourseService,
  deleteOfferedCourseService,
};
