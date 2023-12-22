import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'rakib.cst.1st@gmail.com',
      pass: 'uwei dcxw bmbc qcaz',
    },
  });

  await transporter.sendMail({
    from: 'rakib.cst.1st@gmail.com', // sender address
    to,
    subject: 'Reset your password within ten minutes!', // Subject line
    text: '', // plain text body
    html,
  });
};
