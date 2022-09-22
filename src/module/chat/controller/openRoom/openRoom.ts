import { Request, Response } from 'express';
import { findMessages } from '@chat-module/chat.services';

const openRoom = async (req: Request, res: Response): Promise<void> => {
  const { roomId } = req.params;
  try {
    const messages = await findMessages(roomId);
    res.status(200).json({ messages });
    return;
  } catch (err) {
    res.sendStatus(500);
  }
};

export default openRoom;
