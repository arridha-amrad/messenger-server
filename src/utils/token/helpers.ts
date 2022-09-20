import { Request } from 'express';

export const getUserIdFromAccToken = (req: Request): string | undefined => {
  return req.app.locals.userId as string | undefined;
};
