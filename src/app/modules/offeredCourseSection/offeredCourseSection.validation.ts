import { z } from "zod";

export const createOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    maxCapacity: z.number({
      required_error: "Max Capacity is required",
    }),
    currentlyEnrolledStudent: z.number({}).optional(),
    offeredCourseId: z.string({
      required_error: "Offered Course Id is required",
    }),
  }),
});

export const updateOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string({}).optional(),
    maxCapacity: z.number({}).optional(),
    currentlyEnrolledStudent: z.number({}).optional(),
    offeredCourseId: z.string({}).optional(),
  }),
});
