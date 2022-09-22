import { Request } from 'express';

export const getUserIdFromAccToken = (req: Request): string => {
  return req.app.locals.userId;
};
