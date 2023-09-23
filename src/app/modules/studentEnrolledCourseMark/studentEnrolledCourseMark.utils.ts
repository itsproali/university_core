import { Course, StudentEnrolledCourse } from "@prisma/client";

export const getGradeFromMarks = (
  marks: number
): { grade: string; point?: number } => {
  let result = {
    grade: "",
    point: 0,
  };
  if (marks >= 0 && marks <= 39) {
    result = {
      grade: "F",
      point: 0,
    };
  } else if (marks >= 40 && marks <= 49) {
    result = {
      grade: "D",
      point: 2.0,
    };
  } else if (marks >= 50 && marks <= 59) {
    result = {
      grade: "C",
      point: 2.5,
    };
  } else if (marks >= 60 && marks <= 69) {
    result = {
      grade: "B",
      point: 3.0,
    };
  } else if (marks >= 70 && marks <= 79) {
    result = {
      grade: "A",
      point: 3.5,
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: "A+",
      point: 4.0,
    };
  }
  return result;
};

export const calculateCGPA = (
  payload: (StudentEnrolledCourse & { course: Course })[]
) => {
  let totalCredit = 0;
  let totalCGPA = 0;

  if (payload.length) {
    for (const grade of payload) {
      totalCGPA += grade.point || 0;
      totalCredit += grade.course.credits || 0;
    }

    const avgCGPA = Number((totalCGPA / payload.length).toFixed(2));
    const avgCredits = totalCredit / payload.length;

    return {
      cgpa: avgCGPA,
      totalCompletedCredits: avgCredits,
    };
  } else {
    return {
      cgpa: 0,
      totalCompletedCredits: 0,
    };
  }
};
