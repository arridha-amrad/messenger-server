import { config } from '@utils/config';
import {
  GoogleTokensResult,
  GoogleUserResult,
  IUser,
  IUserData,
} from './user.types';
import axios from 'axios';
import qs from 'qs';
import UserModel from './user.model';

export const getData = (user: IUser): IUserData => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    imageURL: user.imageURL,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const save = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new UserModel(data);
  try {
    const newUser = await user.save();
    return newUser;
  } catch (err) {
    console.log(err);
    throw new Error('Saving user failure');
  }
};

export const findUser = async (query: string): Promise<IUser | null> => {
  try {
    const user = await UserModel.findOne(
      query.includes('@')
        ? {
            email: query,
          }
        : {
            username: query,
          }
    );
    return user;
  } catch (err) {
    throw new Error('Query user failure');
  }
};

export const findUserById = async (userId: string): Promise<IUser | null> => {
  try {
    const user = await UserModel.findById(userId);
    return user;
  } catch (err) {
    throw new Error('findUserById failed');
  }
};

export const findUserByIdAndUpdate = async (
  userId: string,
  update: Partial<IUser>
): Promise<IUser | null> => {
  try {
    const user = await UserModel.findByIdAndUpdate(userId, update, {
      new: true,
    });
    return user;
  } catch (err) {
    throw new Error('findUserByIdAndUpdate failed');
  }
};

export const findUserByToken = async (token: string): Promise<IUser | null> => {
  try {
    const user = await UserModel.findOne({
      tokens: token,
    });
    return user;
  } catch (err) {
    throw new Error('findUserByToken failed');
  }
};

export const removeToken = async (token: string): Promise<void> => {
  try {
    await UserModel.findOneAndRemove({ tokens: token });
  } catch (err) {
    throw new Error('Remove token failed');
  }
};

export const getGoogleUser = async (
  idToken: string,
  accessToken: string
): Promise<GoogleUserResult> => {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};

export const getGoogleOAuthTokens = async ({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> => {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: config.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: config.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri: config.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: 'authorization_code',
  };

  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
