import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourseStatus,
} from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import getPrismaQuery from "../../../helpers/getPrismaQuery";
import { IQueryParams } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import {
  calculateCGPA,
  getGradeFromMarks,
} from "./studentEnrolledCourseMark.utils";

type PayloadProps = {
  studentId: string;
  academicSemesterId: string;
  studentEnrolledCourseId: string;
};

const createStudentEnrolledCourseDefaultMark = async (
  tx: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  { studentId, academicSemesterId, studentEnrolledCourseId }: PayloadProps
) => {
  const isExistMidterm = await tx.studentEnrolledCourseMark.findFirst({
    where: {
      studentId,
      academicSemesterId,
      studentEnrolledCourseId,
      examType: ExamType.MIDTERM,
    },
    select: {
      id: true,
    },
  });

  if (!isExistMidterm) {
    await tx.studentEnrolledCourseMark.create({
      data: {
        studentId,
        academicSemesterId,
        studentEnrolledCourseId,
        examType: ExamType.MIDTERM,
      },
    });
  }

  const isExistFinal = await tx.studentEnrolledCourseMark.findFirst({
    where: {
      studentId,
      academicSemesterId,
      studentEnrolledCourseId,
      examType: ExamType.FINAL,
    },
    select: {
      id: true,
    },
  });

  if (!isExistFinal) {
    await tx.studentEnrolledCourseMark.create({
      data: {
        studentId,
        academicSemesterId,
        studentEnrolledCourseId,
        examType: ExamType.FINAL,
      },
    });
  }
};

const getAllStudentEnrolledCourseMarkService = async (
  options: Partial<IQueryParams>
) => {
  const query = getPrismaQuery(options, ["id"]);

  const result = await prisma.studentEnrolledCourse.findMany(query);
  const total = await prisma.studentEnrolledCourse.count();

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

const updateStudentMarkService = async ({
  studentId,
  academicSemesterId,
  courseId,
  examType,
  marks,
}: {
  studentId: string;
  academicSemesterId: string;
  courseId: string;
  examType: ExamType;
  marks: number;
}) => {
  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        studentId,
        academicSemesterId,
        studentEnrolledCourse: {
          courseId,
        },
        examType,
      },
    });

  if (!studentEnrolledCourseMarks) {
    throw new Error("Student enrolled course mark not found");
  }

  const { grade } = getGradeFromMarks(marks);

  const updateStudentMark = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMarks.id,
    },
    data: {
      marks,
      grade,
    },
  });

  return updateStudentMark;
};

const updateFinalMarkService = async ({
  studentId,
  academicSemesterId,
  courseId,
}: {
  studentId: string;
  academicSemesterId: string;
  courseId: string;
}) => {
  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      studentId,
      academicSemesterId,
      courseId,
    },
    select: {
      id: true,
    },
  });

  if (!studentEnrolledCourse) {
    throw new Error("Student enrolled course not found");
  }

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        studentEnrolledCourseId: studentEnrolledCourse.id,
      },
    });

  if (!studentEnrolledCourseMarks.length) {
    throw new Error("Student enrolled course mark not found");
  }

  const midtermMarks =
    studentEnrolledCourseMarks.find(mark => mark.examType === ExamType.MIDTERM)
      ?.marks || 0;

  const finalMarks =
    studentEnrolledCourseMarks.find(mark => mark.examType === ExamType.FINAL)
      ?.marks || 0;

  const totalMarks = Math.ceil(midtermMarks * 0.4 + finalMarks * 0.6);

  const { grade, point } = getGradeFromMarks(totalMarks);

  await prisma.studentEnrolledCourse.update({
    where: {
      id: studentEnrolledCourse.id,
    },
    data: {
      totalMarks,
      grade,
      point,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });

  const grades = await prisma.studentEnrolledCourse.findMany({
    where: {
      studentId,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
    },
  });

  const { cgpa, totalCompletedCredits } = calculateCGPA(grades);

  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      studentId,
    },
  });
  if (studentAcademicInfo) {
    await prisma.studentAcademicInfo.update({
      where: {
        id: studentAcademicInfo.id,
      },
      data: {
        cgpa,
        totalCompletedCredits,
      },
    });
  } else {
    await prisma.studentAcademicInfo.create({
      data: {
        studentId,
        cgpa,
        totalCompletedCredits,
      },
    });
  }

  return grades;
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  getAllStudentEnrolledCourseMarkService,
  updateStudentMarkService,
  updateFinalMarkService,
};
