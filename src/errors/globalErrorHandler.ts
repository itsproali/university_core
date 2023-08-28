/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { IGenericErrorMessage } from '../interfaces/common';
import sendResponse from '../shared/sendResponse';
import ApiError from './ApiError';
import handleMongooseError from './handleMongooseError';
import handleZodError from './handleZodError';

// Global Error Handler
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];

  if (err?.name === 'ValidationError') {
    const simplified = handleMongooseError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID';
    errorMessages = [
      {
        path: err?.path || '',
        message: 'Invalid ID',
      },
    ];
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    errorMessages = [
      {
        path: Object.keys(err.keyValue)[0],
        message: 'Duplicate field value entered',
      },
    ];
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = err?.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : [];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = err?.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : [];
  }

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    errorMessages,
    stack: config.isDevelopment ? err.stack : undefined,
  });
};

export default globalErrorHandler;
