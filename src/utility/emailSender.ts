import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async ({ to, subject, body }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: body,
    });
    console.log('Email sent to:', to);
};


