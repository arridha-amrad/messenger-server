import { Schema, model, Model } from 'mongoose';
import { IRoom } from '../chat.types';
import User from './user.model';

const RoomSchema = new Schema<IRoom>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: User,
      },
    ],
    groupName: String,
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'messages',
    },
  },

  { timestamps: true }
);

const RoomModel = model('rooms', RoomSchema) as Model<IRoom>;

export default RoomModel;
