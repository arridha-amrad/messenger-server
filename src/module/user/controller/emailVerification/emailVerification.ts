import { Request, Response } from 'express';

import {
   findUserById,
   findUserByIdAndUpdate,
} from '@user-module/user.services';
import { config } from '@utils/config';
import { verifyToken } from '@utils/token/token';

const emailVerification = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { token } = req.params;
   try {
      const { userId, type } = await verifyToken(token, 'link');
      if (type !== 'link') {
         res.status(400).send('<p>Your token is invalid</p>');
         return;
      }
      const user = await findUserById(userId);
      if (user === null) {
         res.status(404).send('<p>User not found</p>');
         return;
      }
      if (user.isVerified) {
         res.status(400).send('<p>Your email has been verified</p>');
         return;
      }
      await findUserByIdAndUpdate(user.id, {
         isVerified: true,
      });
      res.status(200).send(
         `<p>Verification Successful</p> <a href=${config.CLIENT_ORIGIN}/login>Click here to login</a>`
      );
      return;
   } catch (err) {
      res.sendStatus(500);
   }
};

export default emailVerification;
