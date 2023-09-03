import { z } from "zod";

export const createBuildingZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});

export const updateBuildingZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});
