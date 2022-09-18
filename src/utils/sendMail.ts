import nodemailer, { SendMailOptions } from 'nodemailer';
import { IMailContent } from './writeEmail';
import { config } from './config';

const sendEmail = async (to: string, content: IMailContent): Promise<void> => {
   const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
         user: config.EMAIL_TRANSPORTER ?? '',
         pass: config.PASSWORD_TRANSPORTER ?? '',
      },
   });
   const contacts: SendMailOptions = {
      from: config.EMAIL_TRANSPORTER,
      to,
   };
   const email = Object.assign({}, content, contacts);
   try {
      await transporter.sendMail(email);
   } catch (err) {
      throw new Error('Sending email failure');
   }
};

export default sendEmail;
