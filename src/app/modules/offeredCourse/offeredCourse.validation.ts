import { z } from "zod";

export const createOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: "Academic Department Id is required",
    }),
    semesterRegistrationId: z.string({
      required_error: "Semester Registration Id is required",
    }),
    courseIds: z.array(z.string({ required_error: "Course Id is required" })),
  }),
});

export const updateOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    courseIds: z.string().optional(),
  }),
});
