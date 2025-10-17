const { authenticator } = require('otplib');
const secret = authenticator.generateSecret();
console.log('TOTP_SECRET=' + secret);
