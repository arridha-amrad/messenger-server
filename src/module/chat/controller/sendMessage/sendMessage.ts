import { getUserIdFromAccToken } from '@root/utils/token/helpers';
import { Request, Response } from 'express';
import { IRoomDoc } from '@chat-module/chat.types';
import { saveRoom, findRoom, saveMessage } from '@chat-module/chat.services';
import mongoose from 'mongoose';

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { text, toId, roomId } = req.body;

  const fromId = getUserIdFromAccToken(req);

  if (typeof fromId === 'undefined') {
    throw new Error('UnAuthenticated');
  }

  let room: IRoomDoc;

  try {
    if (roomId !== '') {
      const fetchedRoom = await findRoom(roomId);
      if (fetchedRoom === null) {
        res.status(404).json({ error: 'room not found' });
        return;
      }
      room = fetchedRoom;
    } else {
      const newRoom = await saveRoom({
        users: [
          new mongoose.Types.ObjectId(fromId),
          new mongoose.Types.ObjectId(toId),
        ],
      });
      room = newRoom;
    }
    const savedMessage = await saveMessage({
      receiver: toId,
      text,
      room: room._id,
      sender: new mongoose.Types.ObjectId(fromId),
    });
    room.lastMessage = new mongoose.Types.ObjectId(savedMessage.id);
    await saveRoom(room);
    res.status(200).json({ message: savedMessage });
    return;
  } catch (err) {
    res.sendStatus(500);
  }
};

export default sendMessage;
