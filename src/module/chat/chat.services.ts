import { IMessage, IMessageDoc, IRoom, IRoomDoc } from './chat.types';
import MessageModel from './models/message.model';
import Room from './models/room.model';

export const populatedRoom = async (
  roomId: string
): Promise<IRoomDoc | null> => {
  try {
    const room = await Room.findById(roomId);
    if (room !== null) {
      const popRoom = await room.populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username imageURL' },
      });
      return popRoom;
    }
    return null;
  } catch (err) {
    console.log(err);
    throw new Error('populated room error');
  }
};

export const findRoom = async (roomId: string): Promise<IRoomDoc | null> => {
  try {
    const room = await Room.findById(roomId);
    return room;
  } catch (err) {
    console.log('findRoom Error : ', err);
    throw new Error('Find Room Error');
  }
};

export const saveMessage = async (
  data: Partial<IMessage>
): Promise<IMessageDoc> => {
  try {
    const message = new MessageModel(data);
    const savedMessage = await message.save();
    return savedMessage;
  } catch (err) {
    console.log('save message error : ', err);
    throw new Error('save message error');
  }
};

export const saveRoom = async (data: Partial<IRoom>): Promise<IRoomDoc> => {
  try {
    const room = new Room(data);
    const newRoom = await room.save();
    return newRoom;
  } catch (err) {
    console.log('Create Room Error : ', err);
    throw new Error('Create Room Error');
  }
};
