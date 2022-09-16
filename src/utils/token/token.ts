import jwt from 'jsonwebtoken';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import path from 'path';

export type TokenTypes = 'link' | 'auth' | 'refresh';

export interface IVerifyTokenPayload {
    userId: string;
    type: TokenTypes;
    iat: number;
    exp: number;
}

const privateKey = fs.readFileSync(path.join(process.cwd(), './keys/private.pem'));
const publicKey = fs.readFileSync(path.join(process.cwd(), './keys/public.pem'));

export const createToken = async (userId: string, type: TokenTypes): Promise<string> => {
    const result: string = await new Promise((resolve, reject) => {
        jwt.sign(
            { userId, type },
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: type === 'link' ? '1d' : type === 'auth' ? '2h' : '1d',
            },
            (err, token) => {
                if (err !== null) {
                    reject(new Error(`Failure on creating token : ${err.message}`));
                }
                resolve(token as string);
            }
        );
    });
    return result;
};

export const verifyToken = async (
    token: string,
    type: TokenTypes
): Promise<IVerifyTokenPayload> => {
    const result: IVerifyTokenPayload = await new Promise((resolve, reject) => {
        jwt.verify(
            token,
            publicKey,
            {
                algorithms: ['RS256'],
                maxAge: type === 'link' ? '1d' : type === 'auth' ? '2h' : '1d',
            },
            (err, payload) => {
                if (err !== null) {
                    reject(new Error(err.message));
                }
                const data = payload as IVerifyTokenPayload;
                resolve(data);
            }
        );
    });
    return result;
};

export const verifyAuthToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const bearerToken = req.headers.authorization;
    if (bearerToken === undefined) {
        res.sendStatus(401);
        return;
    }
    const token = bearerToken.split(' ')[1];
    jwt.verify(
        token,
        publicKey,
        {
            algorithms: ['RS256'],
            maxAge: '2h',
        },
        (err, payload) => {
            if (err !== null && err.message === 'jwt expired') {
                res.status(401).send('token expired');
                return;
            }
            const { userId } = payload as { userId: string };
            req.app.locals.userId = userId;
            next();
        }
    );
};
