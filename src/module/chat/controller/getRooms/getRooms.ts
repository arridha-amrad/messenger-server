import { getUserIdFromAccToken } from '@root/utils/token/helpers';
import { Request, Response } from 'express';
import { findRooms } from '@chat-module/chat.services';

const getRooms = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserIdFromAccToken(req);
  try {
    const rooms = await findRooms(userId);
    res.status(200).json(rooms);
    return;
  } catch (err) {
    res.sendStatus(500);
  }
};

export default getRooms;
