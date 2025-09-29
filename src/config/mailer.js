import nodemailer from 'nodemailer';
const transporter=nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
transporter.verify().then(()=>{
    console.log('Mailer configured');
}).catch(err=>{
    console.warn('Mailer not verified:', err.message);
});

export default transporter;