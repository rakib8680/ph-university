import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));

// application routes
app.use('/api/v1', router);

// test route
const test = (req: Request, res: Response) => {
  res.send('Hello World!');
};
app.get('/', test);

// global error handling
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
