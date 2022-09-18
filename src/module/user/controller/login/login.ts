import { config } from '@utils/config';
import { createToken } from '@utils/token/token';
import { ILoginDTO } from '@user-module/user.types';
import { NextFunction, Request, Response } from 'express';

import { removeToken, findUser } from '@user-module/user.services';
import {
   getRefreshTokenFromCookie,
   setCookieOptions,
} from '@utils/cookies/cookie';
import { validateLogin } from '@user-module/user.validator';
import { verify } from 'argon2';

const login = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   const currentRefToken = getRefreshTokenFromCookie(req);
   if (currentRefToken !== undefined) {
      await removeToken(currentRefToken);
   }
   const { identity, password }: ILoginDTO = req.body;
   const { valid, errors } = validateLogin({
      identity,
      password,
   });
   if (!valid) {
      res.status(400).json(errors);
      return;
   }
   try {
      const user = await findUser(identity);
      if (user === null) {
         res.status(404).send('User not found');
         return;
      }
      if (!user.isVerified) {
         res.status(400).send('Please verify your email before login');
         return;
      }
      if (user.strategy !== 'default') {
         res.status(400).send(
            'This account is registered with different strategy'
         );
         return;
      }
      const isMatch = await verify(user.password, password);
      if (!isMatch) {
         res.status(400).send('Password not match');
         return;
      }
      const authToken = await createToken(user.id, 'auth');
      const refreshToken = await createToken(user.id, 'refresh');
      user.tokens.push(refreshToken);
      await user.save();
      const loginUser = {
         _id: user.id,
         username: user.username,
         email: user.email,
         fullName: user.fullName,
         imageURL: user.imageURL,
      };
      const bearerAuthToken = `Bearer ${authToken}`;
      const bearerRefToken = `Bearer ${refreshToken}`;
      res.status(200)
         .cookie(config.REF_COOKIE_NAME, bearerRefToken, setCookieOptions)
         .json({
            token: bearerAuthToken,
            user: loginUser,
         });
      return;
   } catch (err) {
      next(err);
   }
};

export default login;
