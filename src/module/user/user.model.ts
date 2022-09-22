import { model, Schema } from 'mongoose';
import { IUser } from './user.types';

export enum STRATEGY {
  default = 'default',
  google = 'google',
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      default: 'default',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    strategy: {
      type: String,
      enum: STRATEGY,
      required: true,
    },
    tokens: {
      type: [String],
      default: [],
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model('users', UserSchema);

export default UserModel;
