import { NextFunction, Request, Response } from 'express';

import writeEmail, { EMAIL_TYPE } from '@root/utils/writeEmail';
import { STRATEGY } from '@user-module/user.model';
import { findUser } from '@user-module/user.services';
import { validateEmail } from '@user-module/user.validator';
import sendEmail from '@utils/sendMail';
import { createToken } from '@utils/token/token';

const forgotPassword = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   const email = req.body.email as string;
   const { errors, valid } = validateEmail(email);
   if (!valid) {
      res.status(403).json(errors);
   }
   try {
      const user = await findUser(email);
      if (user === null) {
         res.status(404).json({ error: 'user not found' });
         return;
      }
      if (!user.isVerified) {
         res.status(400).json({ error: 'please verify your email' });
         return;
      }
      if (user.strategy !== STRATEGY.default) {
         res.status(400).json({
            error: 'your account is created with different strategy',
         });
         return;
      }

      const token = await createToken(user.id, 'link');
      const emailContent = writeEmail(
         user.username,
         token,
         EMAIL_TYPE.resetPassword
      );
      await sendEmail(email, emailContent);
      res.status(200).json({
         message: `An email has been sent to ${email}. Please follow the instructions to reset your password.`,
      });
      return;
   } catch (err) {
      next(err);
   }
};

export default forgotPassword;
