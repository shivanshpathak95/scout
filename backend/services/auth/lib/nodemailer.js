import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
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

export const sendOtpEmail = async (to, otp) => {
    const subject = 'Verify your email';
    const text = `Your verification code is ${otp}. It expires in 10 minutes.`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
            <h2>Verify your email</h2>
            <p>Use the code below to verify your account. This code expires in 10 minutes.</p>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
            <p>If you did not request this, you can safely ignore this email.</p>
        </div>
    `;
    return sendMail(to, subject, text, html);
}
