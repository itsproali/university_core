import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyController } from "./faculty.controller";
import {
  assignRemoveCoursesZodSchema,
  createFacultyZodSchema,
  updateFacultyZodSchema,
} from "./faculty.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createFacultyZodSchema),
  FacultyController.createFaculty
);

router.get("/", queryParams, FacultyController.getAllFaculty);
router.get("/:id", FacultyController.getSingleFaculty);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateFacultyZodSchema),
  FacultyController.updateFaculty
);

router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteFaculty
);

router.post(
  "/assign-courses/:id",
  authGuard(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  validateRequest(assignRemoveCoursesZodSchema),
  FacultyController.assignCourses
);

router.delete(
  "/remove-courses/:id",
  authGuard(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  validateRequest(assignRemoveCoursesZodSchema),
  FacultyController.removeCourses
);


export const FacultyRoutes = router;
