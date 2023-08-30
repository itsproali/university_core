import { z } from "zod";
import { months } from "../../../constants/months";

export const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.enum(["Autumn", "Summer", "Fall"], {
      required_error: "Title is required",
    }),
    year: z.string({
      required_error: "Year is required",
    }),
    code: z.enum(["01", "02", "03"]),
    startMonth: z.enum(months, {
      required_error: "Start month is required",
    }),
    endMonth: z.enum(months, {
      required_error: "End month is required",
    }),
  }),
});

export const updateAcademicSemesterZodSchema = z.object({
  body: z
    .object({
      title: z.enum(["Autumn", "Summer", "Fall"]).optional(),
      year: z.string().optional(),
      code: z.enum(["01", "02", "03"]).optional(),
      startMonth: z.enum(months).optional(),
      endMonth: z.enum(months).optional(),
    })
    .refine(data => (data.title && data.code) || (!data.title && !data.code), {
      message: "Title and code must be provided together",
      path: ["title", "code"],
    }),
});
