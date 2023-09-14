import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import { createSemesterRegistrationZodSchema } from "./semesterRegistration.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createSemesterRegistrationZodSchema),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  "/",
  queryParams,
  SemesterRegistrationController.getAllSemesterRegistration
);

router.get(
  "/:id",
  SemesterRegistrationController.getSingleSemesterRegistration
);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.updateSemesterRegistration
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.deleteSemesterRegistration
);

router.post(
  "/start/:id",
  authGuard(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.startRegistration
);

export const SemesterRegistrationRoutes = router;
