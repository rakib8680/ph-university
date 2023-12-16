/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from '../interFace/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // extract message from err.message
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources = [
    {
      path: '',
      message: `| ${extractedMessage} | is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleDuplicateError;
