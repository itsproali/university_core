import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import {
  createSemesterRegistrationZodSchema,
  enrollOrWithdrawCourseZodSchema,
} from "./semesterRegistration.validation";

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
  "/get-semester-courses",
  authGuard(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getSemesterCourses
);

router.post(
  "/start-registration",
  authGuard(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.startRegistration
);

router.post(
  "/enroll-into-course",
  authGuard(ENUM_USER_ROLE.STUDENT),
  validateRequest(enrollOrWithdrawCourseZodSchema),
  SemesterRegistrationController.enrollIntoCourse
);

router.post(
  "/withdraw-from-course",
  authGuard(ENUM_USER_ROLE.STUDENT),
  validateRequest(enrollOrWithdrawCourseZodSchema),
  SemesterRegistrationController.withdrawFromCourse
);

router.post(
  "/confirm-registration",
  authGuard(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmRegistration
);

router.get(
  "/student-registration",
  authGuard(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getStudentRegistration
);

router.post(
  "/start-new-semester/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.startNewSemester
);

// Dynamic routes
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

export const SemesterRegistrationRoutes = router;
