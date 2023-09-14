import {
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";

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

export const SemesterRegistrationService = {
  createSemesterRegistrationService,
  getAllSemesterRegistrationService,
  getSingleSemesterRegistrationService,
  updateSemesterRegistrationService,
  deleteSemesterRegistrationService,
  startSemesterRegistrationService,
};
