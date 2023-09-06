import { Prisma } from "@prisma/client";
import { IGenericErrorResponse } from "../interfaces/common";

export const handlePrismaValidationError = (
  error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
  const errors = [
    {
      path: "",
      message: error?.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Invalid Input data",
    errorMessages: errors,
  };
};

export const handlePrismaRequestError = (
  error: Prisma.PrismaClientKnownRequestError
): IGenericErrorResponse => {
  let message = "";
  const errors = [
    {
      path: "",
      message: error?.message,
    },
  ];

  if (error.code === "P2025") {
    message = String(error?.meta?.cause) || "Record not found";
    return {
      statusCode: 404,
      message,
      errorMessages: errors,
    };
  } else if (error.code === "P2003") {
    message = String(error?.meta?.cause);
    return {
      statusCode: 400,
      message,
      errorMessages: errors,
    };
  }

  return {
    statusCode: 500,
    message: "Something went wrong",
    errorMessages: errors,
  };
};
