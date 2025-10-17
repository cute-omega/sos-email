// Vercel Serverless Function: /api/alert.js
// 用于通过 SMTP 发送邮件


const nodemailer = require('nodemailer');
const { authenticator } = require('otplib');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // TOTP 校验
    const totpSecret = process.env.TOTP_SECRET;
    const { token, to, subject, text, html } = req.body || {};
    if (!totpSecret) {
        res.status(500).json({ error: 'TOTP secret not configured' });
        return;
    }
    if (!token || !authenticator.check(token, totpSecret)) {
        res.status(401).json({ error: 'Invalid or missing TOTP token' });
        return;
    }

    if (!to || !subject || (!text && !html)) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    // SMTP 配置通过环境变量传递
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to,
            subject,
            text,
            html,
        });
        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
