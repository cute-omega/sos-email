
// 真发邮件测试脚本
const path = require('path');
const dotenv = require('dotenv');
const { authenticator } = require('otplib');

// 读取 .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const handler = require(path.join('..', 'api', 'alert.js'));

// 真实调用 handler
function createFakeRes() {
    return {
        _status: null,
        _json: null,
        status(code) {
            this._status = code;
            return this;
        },
        json(payload) {
            this._json = payload;
            this._ended = true;
            console.log('响应:', this._status, payload);
        },
    };
}

async function main() {
    // 请填写收件人邮箱
    const to = process.env.TEST_TO || 'aqyz909@foxmail.com';
    const subject = '接口测试邮件';
    const text = '这是一封由接口自动发出的测试邮件';
    const html = '<b>这是一封由接口自动发出的测试邮件</b>';

    // 自动生成 TOTP token
    const token = authenticator.generate(process.env.TOTP_SECRET);

    const req = {
        method: 'POST',
        body: { to, subject, text, html, token },
    };
    const res = createFakeRes();
    await handler(req, res);
    console.log('状态码:', res._status);
    console.log('返回内容:', res._json);
}

main();
