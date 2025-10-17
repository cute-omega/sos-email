// Vercel Serverless Function: /api/alert.js
// 用于通过 SMTP 发送邮件

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { to, subject, text, html } = req.body || {};
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
