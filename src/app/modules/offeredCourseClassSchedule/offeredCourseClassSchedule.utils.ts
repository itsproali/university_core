import { OfferedCourseClassSchedule } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { hasTimeConflict } from "../../../shared/utils";

export const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
  const existingSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      room: {
        id: data.roomId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, "Room is already booked!");
  }
};

export const checkFacultyAvailable = async (
  data: OfferedCourseClassSchedule
) => {
  const existingSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      faculty: {
        id: data.facultyId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, "Faculty is already booked!");
  }
};
