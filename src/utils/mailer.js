import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter=nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
transporter.verify()
    .then(()=>{console.log('Mailer configured');})
    .catch(err=>console.warn('Mailer not verified:', err.message));

export const sendTestMail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: 'destinatario@example.com',
      subject: 'Prueba de correo Mailtrap',
      text: 'Este es un correo de prueba enviado desde Mailtrap.',
      html: '<b>Este es un correo de prueba enviado desde Mailtrap</b>'
    });
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('Error enviando correo de prueba:', err.message);
  }
};

export default transporter;