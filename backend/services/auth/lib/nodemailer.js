import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransprt({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendMail = async (to,subject,text,html) => {
    try {
        const info = await transporter.sendMail({
        from: `"My App Name" <${process.env.EMAIL_USER}>`, // Sender address
        to: to,                                            // List of receivers
        subject: subject,                                  // Subject line
        text: text,                                        // Plain text body
        html: html,
        });
        console.log(`Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
} 

