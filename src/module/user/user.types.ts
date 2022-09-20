import { STRATEGY } from './user.model';

export interface IUserData {
  id: string;
  username: string;
  email: string;
  fullname: string;
  imageURL: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  strategy: STRATEGY;
  isVerified: boolean;
  tokens: string[];
  fullname: string;
  imageURL: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterDTO {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface ILoginDTO {
  identity: string;
  password: string;
}

export interface IFieldError {
  field: string;
  message: string;
}

export interface IValidatorResult {
  errors: IFieldError[];
  valid: boolean;
}

export interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
