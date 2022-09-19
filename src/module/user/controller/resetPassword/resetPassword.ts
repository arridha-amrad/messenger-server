import { hash } from 'argon2';
import { Request, Response } from 'express';

import {
   findUserById,
   findUserByIdAndUpdate,
} from '@user-module/user.services';
import { validatePassword } from '@user-module/user.validator';
import { verifyToken } from '@utils/token/token';

const resetPassword = async (req: Request, res: Response): Promise<void> => {
   const { password } = req.body;
   const { token } = req.params;
   const { errors, valid } = validatePassword(password);
   if (!valid) {
      res.status(403).json(errors);
      return;
   }
   try {
      const { userId, type } = await verifyToken(token, 'link');
      if (type !== 'link') {
         res.status(400).json({ error: 'invalid token' });
         return;
      }
      const user = await findUserById(userId);
      if (user === null) {
         res.status(404).json({ error: 'user not found' });
         return;
      }
      await findUserByIdAndUpdate(user.id, {
         password: await hash(password),
         tokens: [],
      });
      res.status(200).json({
         message:
            'congratulations! Your password have changed successfully. Now you can login with your new password.',
      });
      return;
   } catch (err) {
      res.sendStatus(500);
   }
};

export default resetPassword;
