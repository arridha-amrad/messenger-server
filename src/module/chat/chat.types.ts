import { Types } from 'mongoose';

export type IRoomDoc = IRoom & { _id: Types.ObjectId };

export type IRoomExtended = IRoom & { sum: number };

export interface IRoom {
  id: string;
  users: Types.ObjectId[];
  groupName?: string;
  isGroup: boolean;
  lastMessage: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type IMessageDoc = IMessage & { _id: Types.ObjectId };

export interface IMessage {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  room: Types.ObjectId;
  id: string;
  text: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
