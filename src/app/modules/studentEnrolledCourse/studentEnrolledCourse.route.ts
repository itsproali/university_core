import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import { StudentEnrolledCourseController } from "./studentEnrolledCourse.controller";

const router = express.Router();

router.get(
  "/",
  queryParams,
  StudentEnrolledCourseController.getAllStudentEnrolledCourse
);
router.get(
  "/:id",
  StudentEnrolledCourseController.getSingleStudentEnrolledCourse
);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.updateStudentEnrolledCourse
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.deleteStudentEnrolledCourse
);

export const StudentEnrolledCourseRoutes = router;
