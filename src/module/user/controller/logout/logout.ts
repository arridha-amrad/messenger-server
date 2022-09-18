import { config } from '@utils/config';
import { getRefreshTokenFromCookie } from '@utils/cookies/cookie';
import { findUserByToken } from '@user-module/user.services';
import { Request, Response, NextFunction } from 'express';

const logout = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   const refreshToken = getRefreshTokenFromCookie(req);
   try {
      const user = await findUserByToken(refreshToken ?? '');
      if (user !== null) {
         const refreshTokens = user.tokens?.filter((rt) => rt !== refreshToken);
         user.tokens = refreshTokens;
         await user.save();
      }
      res.clearCookie(config.REF_COOKIE_NAME).send('logout successfully');
      return;
   } catch (err) {
      next(err);
   }
};

export default logout;
