/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfferedCourseSection } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import {
  checkFacultyAvailable,
  checkRoomAvailable,
} from "../offeredCourseClassSchedule/offeredCourseClassSchedule.utils";

const createOfferedCourseSectionService = async (
  payload: any
): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...data } = payload;
  const offeredCourse = await prisma.offeredCourse.findUnique({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!offeredCourse) {
    throw new Error("Offered Course does not exist");
  }

  data.semesterRegistrationId = offeredCourse.semesterRegistrationId;

  await asyncForEach(classSchedules, async (schedule: any) => {
    await checkRoomAvailable(schedule);
    await checkFacultyAvailable(schedule);
  });

  const isExist = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourseId: data.offeredCourseId,
      title: data.title,
    },
  });

  if (isExist) {
    throw new Error("Offered Course Section already exist");
  }

  const create = await prisma.$transaction(async tx => {
    const offeredCourseSection = await tx.offeredCourseSection.create({
      data: data,
    });

    if (classSchedules.length !== 0) {
      await tx.offeredCourseClassSchedule.createMany({
        data: payload.classSchedules.map((schedule: any) => ({
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          dayOfWeek: schedule.dayOfWeek,
          offeredCourseSectionId: offeredCourseSection.id,
          semesterRegistrationId: offeredCourse.semesterRegistrationId,
          roomId: schedule.roomId,
          facultyId: schedule.facultyId,
        })),
      });
    }
    return offeredCourseSection;
  });

  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id: create.id,
    },
    include: {
      offeredCourse: true,
      offeredCourseClassSchedules: true,
    },
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
