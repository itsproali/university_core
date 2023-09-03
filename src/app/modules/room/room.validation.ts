import { z } from "zod";

export const createRoomZodSchema = z.object({
  body: z.object({
    roomNumber: z
      .string({
        required_error: "Room number is required",
      })
      .min(1),
    floor: z.string({
      required_error: "Floor is required",
    }),
    buildingId: z.string({
      required_error: "Building is required",
    }),
  }),
});

export const updateRoomZodSchema = z.object({
  body: z.object({
    roomNumber: z.string().optional(),
    floor: z.string().optional(),
    buildingId: z.string().optional(),
  }),
});
