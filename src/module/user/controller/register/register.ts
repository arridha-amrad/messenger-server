import { hash } from 'argon2';
import { NextFunction, Request, Response } from 'express';

import { STRATEGY } from '@user-module/user.model';
import { findUser, save } from '@user-module/user.services';
import { validateRegistration } from '@user-module/user.validator';

import sendEmail from '@utils/sendMail';
import { createToken } from '@utils/token/token';
import writeEmail, { EMAIL_TYPE } from '@utils/writeEmail';

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, username } = req.body;
    const { errors, valid } = validateRegistration({
        email,
        password,
        username,
    });
    if (!valid) {
        res.status(400).json(errors);
        return;
    }
    try {
        const isEmailExist = await findUser(email);
        if (isEmailExist !== null) {
            res.status(403).send('Email already registered');
            return;
        }
        const isUsernameExist = await findUser(username);
        if (isUsernameExist !== null) {
            res.status(403).send('Username already registered');
            return;
        }
        const hashedPassword = await hash(password);
        const newUser = await save({
            email,
            password: hashedPassword,
            username,
            strategy: STRATEGY.default,
        });
        const token = await createToken(newUser.id, 'link');
        const emailContent = writeEmail(newUser.username, token, EMAIL_TYPE.confirmation);
        await sendEmail(newUser.email, emailContent);
        res.status(201).json({
            message: `An email has been sent to ${newUser.email}, please follow the instruction to verify your registration.`,
        });
        return;
    } catch (err) {
        next(err);
    }
};

export default register;
