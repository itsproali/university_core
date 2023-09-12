import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";

import { OfferedCourseClassScheduleController } from "./offeredCourseClassSchedule.controller";
import {
  createOfferedCourseClassScheduleZodSchema,
  updateOfferedCourseClassScheduleZodSchema,
} from "./offeredCourseClassSchedule.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createOfferedCourseClassScheduleZodSchema),
  OfferedCourseClassScheduleController.createOfferedCourseClassSchedule
);

router.get(
  "/",
  queryParams,
  OfferedCourseClassScheduleController.getAllOfferedCourseClassSchedule
);
router.get(
  "/:id",
  OfferedCourseClassScheduleController.getSingleOfferedCourseClassSchedule
);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateOfferedCourseClassScheduleZodSchema),
  OfferedCourseClassScheduleController.updateOfferedCourseClassSchedule
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.deleteOfferedCourseClassSchedule
);

export const OfferedCourseClassScheduleRoutes = router;
