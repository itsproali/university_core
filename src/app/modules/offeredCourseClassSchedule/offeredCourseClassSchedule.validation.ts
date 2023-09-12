import { WeekDays } from "@prisma/client";
import { z } from "zod";

export const createOfferedCourseClassScheduleZodSchema = z.object({
  body: z.object({
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string({
      required_error: "End time is required",
    }),
    dayOfWeek: z
      .enum([...Object.values(WeekDays)] as [string, ...string[]], {
        // required_error: "Day of week is required",
      })
      .optional(),
    offeredCourseSectionId: z.string({
      required_error: "Offered course section is required",
    }),
    semesterRegistrationId: z.string({
      required_error: "Semester registration is required",
    }),
    roomId: z.string({
      required_error: "Room is required",
    }),
    facultyId: z.string({
      required_error: "Faculty is required",
    }),
  }),
});

export const updateOfferedCourseClassScheduleZodSchema = z.object({
  body: z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    dayOfWeek: z
      .enum([...Object.values(WeekDays)] as [string, ...string[]])
      .optional(),
    offeredCourseSectionId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    roomId: z.string().optional(),
    facultyId: z.string().optional(),
  }),
});
