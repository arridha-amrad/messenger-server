import { RegisterDTO, IFieldError, IValidatorResult } from './user.types';

export const validateRegistration = (data: RegisterDTO): IValidatorResult => {
    const emailRegEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    // contains lowercase, numbers, underscore, min length 5
    const usernameRegEx = /^[a-z0-9_]{5,}$/;

    // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    const { email, password, username } = data;

    let errors: IFieldError[] = [];
    if (username.match(usernameRegEx) === null) {
        errors = [
            ...errors,
            {
                field: 'username',
                message: 'username is invalid',
            },
        ];
    }

    if (email.match(emailRegEx) === null) {
        errors = [
            ...errors,
            {
                field: 'email',
                message: 'email is not valid',
            },
        ];
    }

    if (password.match(passwordRegEx) === null) {
        errors = [
            ...errors,
            {
                field: 'password',
                message:
                    'password requires eight characters, with combination of uppercase, lowercase and number',
            },
        ];
    }
    return {
        errors,
        valid: errors.length <= 0,
    };
};
