import { z } from "zod";

export const createAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Department Title is Required" }),
    academicFacultyId: z.string({
      required_error: "Academic Faculty is Required",
    }),
  }),
});
