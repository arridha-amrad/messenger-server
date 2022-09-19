import { config } from '@utils/config';
import { getRefreshTokenFromCookie } from '@utils/cookies/cookie';
import { findUserByToken, save } from '@user-module/user.services';
import { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
   const refreshToken = getRefreshTokenFromCookie(req);
   try {
      const user = await findUserByToken(refreshToken ?? '');
      if (user !== null) {
         const refreshTokens = user.tokens?.filter((rt) => rt !== refreshToken);
         user.tokens = refreshTokens;
         await save(user);
      }
      res.clearCookie(config.REF_COOKIE_NAME).send('logout successfully');
      return;
   } catch (err) {
      res.sendStatus(500);
   }
};

export default logout;
