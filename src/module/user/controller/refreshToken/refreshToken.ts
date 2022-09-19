import { config } from '@utils/config';
import { createToken, verifyToken } from '@utils/token/token';
import { Request, Response } from 'express';
import {
   findUserById,
   findUserByToken,
   save,
} from '@user-module/user.services';
import {
   getRefreshTokenFromCookie,
   setCookieOptions,
} from '@utils/cookies/cookie';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
   const refreshToken = getRefreshTokenFromCookie(req);
   if (typeof refreshToken === 'undefined') {
      res.status(403).json({ error: 'ref token was not included' });
      return;
   }
   try {
      const { userId, type } = await verifyToken(refreshToken, 'refresh');
      if (type !== 'refresh') {
         res.status(403).json({ error: 'token invalid' });
         return;
      }
      const user = await findUserByToken(refreshToken);
      // Refresh Token reuse detected
      if (user === null) {
         const hackedUser = await findUserById(userId);
         if (hackedUser !== null) {
            hackedUser.tokens = [];
            await save(hackedUser);
         }
         res.status(403).json({ error: 'reuse detected' });
         return;
      }
      const newRefreshTokens = user.tokens.filter((rt) => rt !== refreshToken);
      const newRefreshToken = await createToken(user.id, 'refresh');
      const newAuthToken = await createToken(user.id, 'auth');
      user.tokens = [...newRefreshTokens, newRefreshToken];
      await save(user);
      res.status(200)
         .cookie(
            config.REF_COOKIE_NAME,
            `Bearer ${newRefreshToken}`,
            setCookieOptions
         )
         .json({ token: `Bearer ${newAuthToken}` });
      return;
   } catch (err) {
      res.sendStatus(500);
   }
};

export default refreshToken;
