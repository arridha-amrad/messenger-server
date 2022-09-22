import { Types } from 'mongoose';

const toObjectId = (id: string): Types.ObjectId => {
  return new Types.ObjectId(id);
};

export default toObjectId;
