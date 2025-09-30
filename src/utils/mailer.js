import nodemailer from 'nodemailer';
const testAccount=await nodemailer.createTestAccount();
const transporter=nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth:{
        user: testAccount.user,
        pass: testAccount.pass
    }
});
transporter.verify()
    .then(()=>{console.log('Mailer configured');})
    .catch(err=>console.warn('Mailer not verified:', err.message));

export default transporter;

export const sendTestMail=async()=>{
    const info=await transporter.sendMail({
        from: '"Test" <test@example.com>',
        to: 'someone@example.com',
        subject: 'Prueba de Nodemailer',
        text: 'Este es un mail de prueba',
        html: '<b>Este es un mail de prueba</b>'
    });
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
};