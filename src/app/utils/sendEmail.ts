import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async () => {
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
    to: 'rk3815606@gmail.com',
    subject: 'Reset your password within ten minutes!', // Subject line
    text: 'Password change koro ', // plain text body
    html: `<b>Hello World</b>`,
  });
};
