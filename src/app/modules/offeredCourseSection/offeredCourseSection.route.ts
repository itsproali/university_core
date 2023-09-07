import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseSectionController } from "./offeredCourseSection.controller";
import {
  createOfferedCourseSectionZodSchema,
  updateOfferedCourseSectionZodSchema,
} from "./offeredCourseSection.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createOfferedCourseSectionZodSchema),
  OfferedCourseSectionController.createOfferedCourseSection
);

router.get(
  "/",
  queryParams,
  OfferedCourseSectionController.getAllOfferedCourseSection
);
router.get(
  "/:id",
  OfferedCourseSectionController.getSingleOfferedCourseSection
);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateOfferedCourseSectionZodSchema),
  OfferedCourseSectionController.updateOfferedCourseSection
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.deleteOfferedCourseSection
);

export const OfferedCourseSectionRoutes = router;
