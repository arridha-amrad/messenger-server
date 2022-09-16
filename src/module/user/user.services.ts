import { UserModel, IUserModel, IUserModelDocument } from './user.model';

export const save = async (data: IUserModel): Promise<IUserModelDocument> => {
    const user = new UserModel(data);
    try {
        const newUser = await user.save();
        return newUser;
    } catch (err) {
        console.log('Err: ', err);

        throw new Error('Saving user failure');
    }
};

export const findUser = async (query: string): Promise<IUserModelDocument | null> => {
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
