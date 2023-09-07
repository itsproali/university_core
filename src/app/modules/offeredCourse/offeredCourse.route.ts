import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";

import { OfferedCourseController } from "./offeredCourse.controller";
import {
  createOfferedCourseZodSchema,
  updateOfferedCourseZodSchema,
} from "./offeredCourse.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createOfferedCourseZodSchema),
  OfferedCourseController.createOfferedCourse
);

router.get("/", queryParams, OfferedCourseController.getAllOfferedCourse);
router.get("/:id", OfferedCourseController.getSingleOfferedCourse);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateOfferedCourseZodSchema),
  OfferedCourseController.updateOfferedCourse
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.deleteOfferedCourse
);

export const OfferedCourseRoutes = router;
