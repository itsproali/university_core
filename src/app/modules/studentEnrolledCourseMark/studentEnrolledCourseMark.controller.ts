import httpStatus from "http-status";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { StudentEnrolledCourseMarkService } from "./studentEnrolledCourseMark.service";

const getAllStudentEnrolledCourseMark = asyncHandler(async (req, res) => {
  const { data, meta } =
    await StudentEnrolledCourseMarkService.getAllStudentEnrolledCourseMarkService(
      req.queryParams
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Marks retrieved successfully",
    meta,
    data,
  });
});

const updateStudentMarks = asyncHandler(async (req, res) => {
  const result =
    await StudentEnrolledCourseMarkService.updateStudentMarkService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update student marks successfully",
    data: result,
  });
});

const updateFinalMarks = asyncHandler(async (req, res) => {
  const result = await StudentEnrolledCourseMarkService.updateFinalMarkService(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update Final Marks successfully",
    data: result,
  });
});

export const StudentEnrolledCourseMarkController = {
  updateStudentMarks,
  getAllStudentEnrolledCourseMark,
  updateFinalMarks,
};
