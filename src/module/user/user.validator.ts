import {
   IFieldError,
   ILoginDTO,
   IValidatorResult,
   IRegisterDTO,
} from './user.types';

const emailRegEx =
   /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

// contains lowercase, numbers, underscore, min length 5
const usernameRegEx = /^[a-z0-9_]{5,}$/;

// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const letterOnlyRegEx = /^[A-Za-z]+$/;

export const validateEmail = (email: string): IValidatorResult => {
   let errors: IFieldError[] = [];
   if (email.match(emailRegEx) === null) {
      errors = [
         ...errors,
         {
            field: 'email',
            message: 'please input your valid email',
         },
      ];
   }
   return {
      errors,
      valid: errors.length <= 0,
   };
};

export const validatePassword = (password: string): IValidatorResult => {
   let errors: IFieldError[] = [];
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

export const validateLogin = (data: ILoginDTO): IValidatorResult => {
   const { identity, password } = data;
   let errors: IFieldError[] = [];
   if (identity.trim() === '') {
      errors = [
         ...errors,
         {
            field: 'identity',
            message: 'please input your username or email',
         },
      ];
   }
   if (password.trim() === '') {
      errors = [
         ...errors,
         {
            field: 'password',
            message: 'password is required',
         },
      ];
   }
   return {
      errors,
      valid: errors.length <= 0,
   };
};

export const validateRegistration = (data: IRegisterDTO): IValidatorResult => {
   const { email, password, username, firstname, lastname } = data;

   let errors: IFieldError[] = [];
   if (firstname.match(letterOnlyRegEx) === null) {
      errors = [
         ...errors,
         {
            field: 'firstname',
            message: 'firstname only accept letters',
         },
      ];
   }
   if (lastname.match(letterOnlyRegEx) === null) {
      errors = [
         ...errors,
         {
            field: 'lastname',
            message: 'lastname only accept letters',
         },
      ];
   }
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
