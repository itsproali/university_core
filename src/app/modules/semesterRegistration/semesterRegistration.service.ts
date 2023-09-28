import {
  OfferedCourse,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import { StudentEnrolledCourseMarkService } from "../studentEnrolledCourseMark/studentEnrolledCourseMark.service";
import { studentSemesterPaymentService } from "../studentSemesterPayment/studentSemesterPayment.service";
import { studentSemesterRegistrationCourseService } from "../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service";
import { IEnrollCoursePayload } from "./semesterRegistration.interface";
import { SemesterRegistrationUtils } from "./semesterRegistration.utils";

const createSemesterRegistrationService = async (
  payload: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isUpcomingOrOngoing = await prisma.semesterRegistration.findFirst({
    where: {
      OR: [
        {
          status: SemesterRegistrationStatus.UPCOMING,
        },
        {
          status: SemesterRegistrationStatus.ONGOING,
        },
      ],
    },
  });

  if (isUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isUpcomingOrOngoing?.status} semester`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data: payload,
  });

  return result;
};

const getAllSemesterRegistrationService = async (
  options: Partial<IQueryParams>
) => {
  const query = getPrismaQuery(options, [
    "startDate",
    "endDate",
    "status",
    "minCredit",
    "maxCredit",
  ]);

  const result = await prisma.semesterRegistration.findMany(query);
  const total = await prisma.semesterRegistration.count();

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

const getSingleSemesterRegistrationService = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const updateSemesterRegistrationService = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration | null> => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Semester registration not found");
  }

  // Update status UPCOMING > ONGOING > ENDED
  if (payload.status) {
    if (isExist.status === SemesterRegistrationStatus.ENDED) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot update ended semester registration"
      );
    }

    if (
      isExist.status === SemesterRegistrationStatus.UPCOMING &&
      payload.status !== SemesterRegistrationStatus.ONGOING
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Upcoming semester registration can only be updated to ongoing"
      );
    }

    if (
      isExist.status === SemesterRegistrationStatus.ONGOING &&
      payload.status !== SemesterRegistrationStatus.ENDED
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Ongoing semester registration can only be updated to ended"
      );
    }
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const deleteSemesterRegistrationService = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
  });

  return result;
};

const startSemesterRegistrationService = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Student Info not found!");
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Registration is not started yet"
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const enrollIntoCourseService = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  return studentSemesterRegistrationCourseService.enrollIntoCourse(
    authUserId,
    payload
  );
};

const withdrawFromCourseService = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  return studentSemesterRegistrationCourseService.withdrewFromCourse(
    authUserId,
    payload
  );
};

const confirmRegistrationService = async (
  authUserId: string
): Promise<{ message: string }> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  // 3 - 6
  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You are not recognized for this semester!"
    );
  }

  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You are not enrolled in any course!"
    );
  }

  if (
    studentSemesterRegistration.totalCreditsTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration.maxCredit &&
    (studentSemesterRegistration.totalCreditsTaken <
      semesterRegistration?.minCredit ||
      studentSemesterRegistration.totalCreditsTaken >
        semesterRegistration?.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });
  return {
    message: "Your registration is confirmed!",
  };
};

const getStudentRegistrationService = async (
  authUserId: string
): Promise<StudentSemesterRegistration[] | null> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no ongoing semester registration"
    );
  }

  const studentSemesterRegistrations =
    await prisma.studentSemesterRegistration.findMany({
      where: {
        semesterRegistration: {
          id: semesterRegistration.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
        semesterRegistration: true,
      },
    });

  return studentSemesterRegistrations;
};

const startNewSemesterService = async (id: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Semester registration not found"
    );
  }

  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Semester Registration is not ended yet"
    );
  }

  if (semesterRegistration.academicSemester.isCurrent) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Semester is already started!");
  }

  await prisma.$transaction(async tx => {
    await tx.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    await tx.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemesterId,
      },
      data: {
        isCurrent: true,
      },
    });

    const studentSemesterRegistrations =
      await prisma.studentSemesterRegistration.findMany({
        where: {
          semesterRegistrationId: id,
          isConfirmed: true,
        },
      });

    await asyncForEach(
      studentSemesterRegistrations,
      async (studentSemReg: StudentSemesterRegistration) => {
        if (studentSemReg.totalCreditsTaken) {
          const totalPaymentAmount = studentSemReg.totalCreditsTaken * 1000;

          await studentSemesterPaymentService.createSemesterPayment(tx, {
            studentId: studentSemReg.studentId,
            academicSemesterId: semesterRegistration.academicSemesterId,
            totalPaymentAmount,
          });
        }

        const studentSemesterRegistrationCourses =
          await tx.studentSemesterRegistrationCourse.findMany({
            where: {
              semesterRegistrationId: id,
              studentId: studentSemReg.studentId,
            },
            include: {
              offeredCourse: {
                include: {
                  course: true,
                },
              },
            },
          });

        await asyncForEach(
          studentSemesterRegistrationCourses,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse;
            }
          ) => {
            const isExist = await tx.studentEnrolledCourse.findFirst({
              where: {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId,
              },
            });

            if (!isExist) {
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId,
              };

              const studentEnrolledCourseData =
                await tx.studentEnrolledCourse.create({
                  data: enrolledCourseData,
                });

              await StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(
                tx,
                {
                  studentId: item.studentId,
                  studentEnrolledCourseId: studentEnrolledCourseData.id,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                }
              );
            }
          }
        );
      }
    );

    // -----
  });
};

const getSemesterCoursesService = async (authUserId: string) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no ongoing semester registration"
    );
  }

  const studentCompletedCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      studentId: student?.id,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });

  const studentCurrentSemesterTakenCourses =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration.id,
      },
    });

  const offeredCourses = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistrationId: semesterRegistration.id,
      academicDepartmentId: student?.academicDepartmentId,
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
    },
  });

  const availableCourses = await SemesterRegistrationUtils.getAvailableCourses(
    offeredCourses,
    studentCompletedCourses,
    studentCurrentSemesterTakenCourses
  );

  return availableCourses;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationService,
  getAllSemesterRegistrationService,
  getSingleSemesterRegistrationService,
  updateSemesterRegistrationService,
  deleteSemesterRegistrationService,
  startSemesterRegistrationService,
  enrollIntoCourseService,
  withdrawFromCourseService,
  confirmRegistrationService,
  getStudentRegistrationService,
  startNewSemesterService,
  getSemesterCoursesService,
};
