import { config } from './config';
import toCapitalCase from './toCapitalCase';

export interface IMailContent {
    subject: string;
    html: string;
}

export enum EMAIL_TYPE {
    confirmation = 'email verification',
    resetPassword = 'reset password',
}

const writeEmail = (username: string, token: string, type: EMAIL_TYPE): IMailContent => {
    let title: string;
    const route = type.replace(/\s/g, '-');

    switch (type) {
        case EMAIL_TYPE.confirmation:
            title = toCapitalCase(type);
            break;
        default:
            title = toCapitalCase(type);
            break;
    }

    return {
        subject: `${config.APP_NAME} - ${title}`,
        html: `<p>Hello ${username}</p><p>Please use the following for your ${type}:</p> <p>${config.SERVER_ORIGIN}/api/user/${route}/${token}</p> <p>Thanks</p>`,
    };
};

export default writeEmail;
