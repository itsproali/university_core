/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import { ICourseProps } from "./course.interface";

const createCourseService = async (
  info: ICourseProps
): Promise<Course | null | undefined> => {
  const { preRequisiteCourses, ...rest } = info;
  const newCourse = await prisma.$transaction(async tx => {
    const result = await tx.course.create({
      data: rest,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create course");
    }

    if (preRequisiteCourses && preRequisiteCourses.length) {
      for (let i = 0; i < preRequisiteCourses.length; i++) {
        await tx.courseToPreRequisite.create({
          data: {
            courseId: result.id,
            preRequisiteId: preRequisiteCourses[i].courseId,
          },
        });
      }
    }

    return result;
  });

  if (newCourse) {
    const result = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },

        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });

    return result;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create course");
};

const getAllCourseService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, ["title", "code", "credits"]);

  const result = await prisma.course.findMany({
    where: query.where,
    skip: query.skip,
    take: query.take,
    orderBy: query.orderBy,

    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },

      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  const total = await prisma.course.count();

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

const getSingleCourseService = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },

      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return result;
};

const updateCourseService = async (
  id: string,
  payload: ICourseProps
): Promise<Course | null> => {
  const { preRequisiteCourses, ...rest } = payload;

  await prisma.$transaction(async tx => {
    const result = await tx.course.update({
      where: {
        id,
      },
      data: rest,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update course");
    }

    // Delete PreRequisite Courses
    if (preRequisiteCourses && preRequisiteCourses?.length) {
      const deletePreRequisite = preRequisiteCourses?.filter(
        item => item.isDeleted
      );

      if (deletePreRequisite?.length) {
        await tx.courseToPreRequisite.deleteMany({
          where: {
            AND: [
              { courseId: id },
              {
                preRequisiteId: {
                  in: deletePreRequisite.map(item => item.courseId),
                },
              },
            ],
          },
        });
      }

      // Add New PreRequisite Courses
      const addPreRequisite = preRequisiteCourses?.filter(
        item => !item.isDeleted
      );

      if (addPreRequisite?.length) {
        for (let i = 0; i < addPreRequisite?.length; i++) {
          await tx.courseToPreRequisite.create({
            data: {
              courseId: id,
              preRequisiteId: addPreRequisite[i].courseId,
            },
          });
        }
      }
    }

    return result;
  });

  const response = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return response;
};

const deleteCourseService = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CourseService = {
  createCourseService,
  getAllCourseService,
  getSingleCourseService,
  updateCourseService,
  deleteCourseService,
};
