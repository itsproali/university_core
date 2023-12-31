import { z } from "zod";

export const createFacultyZodSchema = z.object({
  body: z.object({
    facultyId: z.string({
      required_error: "Faculty ID is required",
    }),
    firstName: z.string({
      required_error: "First name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.string({
      required_error: "Gender is required",
    }),
    bloodGroup: z.string({
      required_error: "Blood group is required",
    }),
    designation: z.string({
      required_error: "Designation is required",
    }),
    academicDepartmentId: z.string({
      required_error: "Academic department is required",
    }),
    academicFacultyId: z.string({
      required_error: "Academic faculty is required",
    }),
  }),
});

export const updateFacultyZodSchema = z.object({
  body: z.object({
    facultyId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    designation: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});

export const assignRemoveCoursesZodSchema = z.object({
  body: z.object({
    courses: z.array(z.string(), {
      required_error: "Courses Are Required",
    }),
  }),
});
