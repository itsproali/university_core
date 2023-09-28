import { Student, StudentEnrolledCourseStatus } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import { StudentUtils } from "./student.utils";

const createStudentService = async (info: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: info,
  });

  return result;
};

const getAllStudentService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, [
    "firstName",
    "lastName",
    "email",
    "contactNo",
    "gender",
    "bloodGroup",
    "designation",
  ]);

  const result = await prisma.student.findMany(query);
  const total = await prisma.student.count();

  return {
    data: result,
    meta: {
      total,
      totalResult: result.length,
      totalPages: Math.ceil(total / (options.limit || 100)),
      currentPage: options.page || 1,
      limit: options.limit,
    },
  };
};

const getSingleStudentService = async (
  studentId: string
): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      studentId,
    },
  });

  return result;
};

const updateStudentService = async (
  id: string,
  info: Partial<Student>
): Promise<Student | null> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteStudentService = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
  });

  return result;
};

const getStudentCoursesService = async (id: string) => {
  const currentSemester = await prisma.academicSemester.findFirst({
    where: {
      isCurrent: true,
    },
  });

  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: id,
      },
      academicSemesterId: currentSemester?.id,
    },
  });

  return result;
};

const getStudentCourseScheduleService = async (authUserId: string) => {
  const currentSemester = await prisma.academicSemester.findFirst({
    where: {
      isCurrent: true,
    },
  });

  const studentEnrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      academicSemesterId: currentSemester?.id,
    },
  });

  const courseIds = studentEnrolledCourses.map(item => item.courseId);
  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      offeredCourse: {
        courseId: {
          in: courseIds,
        },
      },
      semesterRegistration: {
        academicSemesterId: currentSemester?.id,
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseSection: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
              faculty: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getAcademicInfoService = async (authUserId: string) => {
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        studentId: authUserId,
      },
    },
  });

  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
      academicSemester: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const groupByAcademicSemesterData =
    StudentUtils.groupByAcademicSemester(enrolledCourses);

  return {
    academicInfo,
    courses: groupByAcademicSemesterData,
  };
};

export const StudentService = {
  createStudentService,
  getAllStudentService,
  getSingleStudentService,
  updateStudentService,
  deleteStudentService,
  getStudentCoursesService,
  getStudentCourseScheduleService,
  getAcademicInfoService,
};
