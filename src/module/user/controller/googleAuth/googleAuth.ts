/* eslint-disable @typescript-eslint/naming-convention */
import { setCookieOptions } from '@utils/cookies/cookie';
import { config } from '@utils/config';
import { createToken } from '@utils/token/token';
import { STRATEGY } from '@user-module/user.model';
import {
   findUser,
   save,
   getGoogleOAuthTokens,
   getGoogleUser,
} from '@user-module/user.services';
import { Request, Response } from 'express';

const googleOAuth = async (req: Request, res: Response): Promise<void> => {
   const code = req.query.code as string;
   try {
      const { access_token, id_token } = await getGoogleOAuthTokens({
         code,
      });
      const googleUser = await getGoogleUser(id_token, access_token);
      if (!googleUser.verified_email) {
         res.status(403).json({ message: 'Google account is not verified' });
      }
      const user = await findUser(googleUser.email);
      if (user !== null && user.strategy !== STRATEGY.google) {
         res.redirect(
            `${config.CLIENT_ORIGIN}/login?e=` +
               encodeURIComponent(
                  'Another user has been registered with this email'
               )
         );
         return;
      }
      const { email, family_name, given_name, name } = googleUser;
      let myUser;
      if (user === null) {
         const newUser = await save({
            password: '',
            fullname: `${given_name} ${family_name}`,
            username: name.split(' ').join(''),
            email,
            isVerified: true,
            strategy: STRATEGY.google,
         });
         myUser = newUser;
      } else {
         myUser = user;
      }
      const refreshToken = await createToken(myUser.id, 'refresh');
      myUser.tokens.push(refreshToken);
      await save(myUser);
      const bearerRefToken = `Bearer ${refreshToken}`;
      res.cookie(config.REF_COOKIE_NAME, bearerRefToken, setCookieOptions);
      res.redirect(config.CLIENT_ORIGIN);
      return;
   } catch (err) {
      res.redirect(
         `${config.CLIENT_ORIGIN}/login?e=` +
            encodeURIComponent('Something went wrong. Please try again')
      );
   }
};

export default googleOAuth;
