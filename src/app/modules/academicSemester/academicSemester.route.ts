import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { createAcademicSemesterZodSchema } from './academicSemester.validation';
const router = express.Router();

router.post(
  '/',
  validateRequest(createAcademicSemesterZodSchema),
  AcademicSemesterController.createAcademicSemester
);

export const AcademicSemesterRoutes = router;
