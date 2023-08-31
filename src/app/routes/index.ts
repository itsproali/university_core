import express from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { StudentRoutes } from "../modules/student/student.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/academic-semester",
    routes: AcademicSemesterRoutes,
  },
  {
    path: "/academic-department",
    routes: AcademicDepartmentRoutes,
  },
  {
    path: "/academic-faculty",
    routes: AcademicFacultyRoutes,
  },
  {
    path: "/faculty",
    routes: FacultyRoutes,
  },
  {
    path: "/student",
    routes: StudentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
