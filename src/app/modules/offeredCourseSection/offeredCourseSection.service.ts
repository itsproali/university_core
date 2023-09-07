import { OfferedCourseSection } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createOfferedCourseSectionService = async (
  payload: OfferedCourseSection
): Promise<OfferedCourseSection> => {
  const offeredCourse = await prisma.offeredCourse.findUnique({
    where: {
      id: payload.offeredCourseId,
    },
  });

  if (!offeredCourse) {
    throw new Error("Offered Course does not exist");
  }

  payload.semesterRegistrationId = offeredCourse.semesterRegistrationId;

  const result = await prisma.offeredCourseSection.create({
    data: payload,
  });

  return result;
};

const getAllOfferedCourseSectionService = async (
  options: Partial<IQueryParams>
) => {
  const query = getPrismaQuery(options, ["title", "offeredCourseId"]);

  const result = await prisma.offeredCourseSection.findMany(query);
  const total = await prisma.offeredCourseSection.count();

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

const getSingleOfferedCourseSectionService = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  return result;
};

const updateOfferedCourseSectionService = async (
  id: string,
  info: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteOfferedCourseSectionService = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
  });

  return result;
};

export const OfferedCourseSectionService = {
  createOfferedCourseSectionService,
  getAllOfferedCourseSectionService,
  getSingleOfferedCourseSectionService,
  updateOfferedCourseSectionService,
  deleteOfferedCourseSectionService,
};
