import { IUserModel } from './user.model';

export type RegisterDTO = Pick<IUserModel, 'email' | 'password' | 'username'>;

export interface IFieldError {
    field: string;
    message: string;
}

export interface IValidatorResult {
    errors: IFieldError[];
    valid: boolean;
}
