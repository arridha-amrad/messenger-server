import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';

export enum STRATEGY {
   default = 'default',
   google = 'google',
}

class User {
   @prop({ required: true, unique: true, type: String })
   email: string;

   @prop({ required: true, unique: true, type: String })
   username: string;

   @prop({ required: true, type: String })
   password: string;

   @prop({ required: true, type: String })
   strategy: STRATEGY;

   @prop({ type: Boolean, default: false })
   isVerified: boolean;

   @prop({ type: () => [String] })
   tokens: string[];

   @prop({ type: String, required: true })
   fullName: string;

   @prop({ type: String })
   imageURL: string;
}

export type IUserModel = User;

export type IUserModelDocument = DocumentType<User>;

export const UserModel = getModelForClass(User, {
   schemaOptions: {
      timestamps: true,
   },
});
