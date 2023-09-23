import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import { StudentEnrolledCourseMarkController } from "./studentEnrolledCourseMark.controller";

const router = express.Router();

router.get(
  "/",
  queryParams,
  StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMark
);

router.patch(
  "/update-marks",
  authGuard(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.updateStudentMarks
);

router.patch(
  "/update-final-marks",
  authGuard(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.updateStudentMarks
);

export const StudentEnrolledCourseMarkRoutes = router;
