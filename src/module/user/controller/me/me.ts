import { getUserIdFromAccToken } from '@utils/token/helpers';
import { Request, Response } from 'express';
import { findUserById, getData } from '@user-module/user.services';

const me = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserIdFromAccToken(req);
  if (typeof userId === 'undefined') {
    res.sendStatus(401);
    return;
  }
  try {
    const user = await findUserById(userId);
    if (user === null) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const userData = getData(user);
    res.status(200).json({ user: userData });
    return;
  } catch (err) {
    res.sendStatus(500);
  }
};

export default me;
