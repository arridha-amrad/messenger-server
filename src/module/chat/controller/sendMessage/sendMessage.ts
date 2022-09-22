import { populateMessage } from './../../chat.services';
import { Request, Response } from 'express';

import { findRoom, saveMessage, saveRoom } from '@chat-module/chat.services';
import { IRoomDoc } from '@chat-module/chat.types';
import { getUserIdFromAccToken } from '@utils/token/helpers';
import toObjectId from '@utils/toObjectId';

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { text, toId, roomId } = req.body;

  const fromId = getUserIdFromAccToken(req);

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
        users: [toObjectId(fromId), toObjectId(toId)],
      });
      room = newRoom;
    }
    const savedMessage = await saveMessage({
      receiver: toId,
      text,
      room: room._id,
      sender: toObjectId(fromId),
    });
    room.lastMessage = toObjectId(savedMessage.id);
    await saveRoom(room);
    const populatedMessage = await populateMessage(savedMessage.id);
    res.status(200).json({ message: populatedMessage });
    return;
  } catch (err) {
    res.sendStatus(500);
  }
};

export default sendMessage;
