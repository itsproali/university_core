/* eslint-disable @typescript-eslint/no-explicit-any */
import { Faculty } from "@prisma/client";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

const createFacultyService = async (info: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: info,
  });

  return result;
};

const getAllFacultyService = async (options: Partial<IQueryParams>) => {
  const query = getPrismaQuery(options, [
    "firstName",
    "lastName",
    "email",
    "contactNo",
    "gender",
    "bloodGroup",
    "designation",
  ]);

  const result = await prisma.faculty.findMany(query);
  const total = await prisma.faculty.count();

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

const getSingleFacultyService = async (
  facultyId: string
): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      facultyId,
    },
  });

  return result;
};

const updateFacultyService = async (
  id: string,
  info: Partial<Faculty>
): Promise<Faculty | null> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: info,
  });

  return result;
};

const deleteFacultyService = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
  });

  return result;
};

const assignCoursesService = async (
  id: string,
  payload: string[]
): Promise<Faculty | null> => {
  await prisma.courseFaculty.createMany({
    data: payload.map((courseId: string) => ({
      facultyId: id,
      courseId,
    })),
  });

  const response = await prisma.faculty.findUnique({
    where: {
      id,
    },
    include: {
      courses: {
        include: {
          course: true,
        },
      },
    },
  });
  return response;
};

const removeCoursesService = async (id: string, payload: string[]) => {
  const result = await prisma.courseFaculty.deleteMany({
    where: {
      AND: [{ facultyId: id }, { courseId: { in: payload } }],
    },
  });

  return result;
};

const getFacultyCoursesService = async (id: string) => {
  const currentSemester = await prisma.academicSemester.findFirst({
    where: {
      isCurrent: true,
    },
  });

  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: id,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemesterId: currentSemester?.id,
        },
      },
    },

    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  const courseAndSchedule = offeredCourseSections.reduce(
    (acc: any, obj: any) => {
      const course = obj.offeredCourse.course;
      const schedules = obj.offeredCourseClassSchedules;

      const existingCourse = acc?.find(
        (item: any) => item?.course?.id === course?.id
      );

      if (existingCourse) {
        existingCourse.sections.push({
          section: obj.section,
          schedules,
        });
      } else {
        acc.push({
          course,
          sections: [
            {
              section: obj.section,
              schedules,
            },
          ],
        });
      }

      return acc;
    },
    []
  );

  return courseAndSchedule;
};

export const FacultyService = {
  createFacultyService,
  getAllFacultyService,
  getSingleFacultyService,
  updateFacultyService,
  deleteFacultyService,
  assignCoursesService,
  removeCoursesService,
  getFacultyCoursesService,
};
