import { OfferedCourseClassSchedule } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import {
  checkFacultyAvailable,
  checkRoomAvailable,
} from "./offeredCourseClassSchedule.utils";

const createOfferedCourseClassScheduleService = async (
  payload: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule | null> => {
  await checkRoomAvailable(payload);
  await checkFacultyAvailable(payload);

  const result = await prisma.offeredCourseClassSchedule.create({
    data: payload,
  });

  return result;
};

const getAllOfferedCourseClassScheduleService = async (
  options: Partial<IQueryParams>
) => {
  const query = getPrismaQuery(options, [
    "dayOfWeek",
    "offeredCourseSectionId",
    "semesterRegistrationId",
    "roomId",
    "facultyId",
  ]);

  const result = await prisma.offeredCourseClassSchedule.findMany(query);
  const total = await prisma.offeredCourseClassSchedule.count();

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

const getSingleOfferedCourseClassScheduleService = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourseSection: true,
      semesterRegistration: true,
      room: true,
      faculty: true,
    },
  });

  return result;
};

const updateOfferedCourseClassScheduleService = async (
  id: string,
  payload: Partial<OfferedCourseClassSchedule>
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteOfferedCourseClassScheduleService = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.delete({
    where: {
      id,
    },
  });

  return result;
};

export const OfferedCourseClassScheduleService = {
  createOfferedCourseClassScheduleService,
  getAllOfferedCourseClassScheduleService,
  getSingleOfferedCourseClassScheduleService,
  updateOfferedCourseClassScheduleService,
  deleteOfferedCourseClassScheduleService,
};
