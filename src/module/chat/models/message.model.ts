import { Schema, model } from 'mongoose';
import { IMessage } from '@chat-module/chat.types';

const MessageSchema = new Schema<IMessage>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: 'rooms',
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    text: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const MessageModel = model<IMessage>('messages', MessageSchema);

export default MessageModel;
