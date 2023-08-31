import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyController } from "./academicFaculty.controller";
import { createAcademicFacultyZodSchema } from "./academicFaculty.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createAcademicFacultyZodSchema),
  AcademicFacultyController.createAcademicFaculty
);

router.get("/", queryParams, AcademicFacultyController.getAllAcademicFaculty);
router.get("/:id", AcademicFacultyController.getSingleAcademicFaculty);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyController.updateAcademicFaculty
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyController.deleteAcademicFaculty
);

export const AcademicFacultyRoutes = router;
