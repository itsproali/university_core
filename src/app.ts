import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import routes from './app/routes';
import globalErrorHandler from './errors/globalErrorHandler';
import sendResponse from './shared/sendResponse';

const app: Application = express();

// Setup Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));

// Default route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to the University Management System API!');
});

// Routes
app.use('/api/v1', routes);

//global error handler
app.use(globalErrorHandler);

// 404 Error handler
app.all('*', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: 'Resource not found',
    errorMessages: [
      {
        path: req.path,
        message: 'Resource not found',
      },
    ],
  });
});

export default app;
