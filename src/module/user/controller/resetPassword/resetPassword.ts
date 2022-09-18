import { hash } from 'argon2';
import { NextFunction, Request, Response } from 'express';

import {
   findUserById,
   findUserByIdAndUpdate,
} from '@user-module/user.services';
import { validatePassword } from '@user-module/user.validator';
import { verifyToken } from '@utils/token/token';

const resetPassword = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   const { password } = req.body;
   const { token } = req.params;
   const { errors, valid } = validatePassword(password);
   if (!valid) {
      res.status(400).json(errors);
      return;
   }
   try {
      const { userId, type } = await verifyToken(token, 'link');
      if (type !== 'link') {
         res.status(400).json({ error: 'Invalid token' });
         return;
      }
      const user = await findUserById(userId);
      if (user === null) {
         res.status(404).send('User not found');
         return;
      }
      await findUserByIdAndUpdate(user.id, {
         password: await hash(password),
         tokens: [],
      });
      res.status(200).json({
         message:
            'Congratulations! Your password have changed successfully. Now you can login with your new password.',
      });
      return;
   } catch (err) {
      next(err);
   }
};

export default resetPassword;
