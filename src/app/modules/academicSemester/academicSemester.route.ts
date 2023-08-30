import express from "express";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterController } from "./academicSemester.controller";
import {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
} from "./academicSemester.validation";
const router = express.Router();

router.post(
  "/",
  validateRequest(createAcademicSemesterZodSchema),
  AcademicSemesterController.createAcademicSemester
);

router.get("/", queryParams, AcademicSemesterController.getAllAcademicSemester);
router.get("/:id", AcademicSemesterController.getSingleAcademicSemester);

router.patch(
  "/:id",
  validateRequest(updateAcademicSemesterZodSchema),
  AcademicSemesterController.updateAcademicSemester
);
router.delete("/:id", AcademicSemesterController.deleteAcademicSemester);

export const AcademicSemesterRoutes = router;
