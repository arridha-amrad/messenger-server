import { CookieOptions, Request } from 'express';

import { config, ENV_ENUM } from '@utils/config';

export const setCookieOptions: CookieOptions = {
   maxAge: 1000 * 60 * 60 * 24 * 365,
   httpOnly: true,
   sameSite: 'lax',
   secure: config.NODE_ENV === ENV_ENUM.prod,
};

export const getRefreshTokenFromCookie = (req: Request): String | undefined => {
   const bearerToken = req.cookies.refreshToken as string | undefined;
   if (typeof bearerToken === 'string') {
      return bearerToken.split(' ')[1];
   }
};
