import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";
import { RoomController } from "./room.controller";
import { createRoomZodSchema, updateRoomZodSchema } from "./room.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createRoomZodSchema),
  RoomController.createRoom
);

router.get("/", queryParams, RoomController.getAllRoom);
router.get("/:id", RoomController.getSingleRoom);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateRoomZodSchema),
  RoomController.updateRoom
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  RoomController.deleteRoom
);

export const RoomRoutes = router;
