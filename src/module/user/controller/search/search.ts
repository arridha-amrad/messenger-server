import { searchUser } from '@user-module/user.services';
import { Request, Response } from 'express';

const search = async (req: Request, res: Response): Promise<void> => {
  const { key } = req.body;
  try {
    const users = await searchUser(key);
    res.status(200).json({ users });
  } catch (err) {
    res.sendStatus(500);
  }
};

export default search;
