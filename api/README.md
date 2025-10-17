# Vercel SMTP 邮件 API 部署与使用说明

## 1. 目录结构

```
api/
  alert.js         # Vercel Serverless Function，处理邮件发送
  package.json     # 依赖声明（nodemailer）
.env.example       # 环境变量示例
```

## 2. 配置环境变量

- 复制 `.env.example` 为 `.env`，填写你的 SMTP 信息：
  - SMTP_HOST：SMTP 服务器地址（如 smtp.qq.com、smtp.163.com 等）
  - SMTP_PORT：端口（465 通常为 SSL，587 为 STARTTLS）
  - SMTP_SECURE：465 填 true，587 填 false
  - SMTP_USER：你的邮箱账号
  - SMTP_PASS：邮箱授权码/应用专用密码
  - SMTP_FROM：发件人邮箱（可与 SMTP_USER 相同）

## 3. 本地开发

```sh
cd api
npm install
# 推荐用 vercel dev 启动本地 serverless 环境
vercel dev
```

## 4. 部署到 Vercel

1. 注册并登录 [Vercel](https://vercel.com/)
2. 新建项目，选择本项目目录
3. 在 Vercel 控制台设置环境变量（与 .env.example 对应）
4. 部署即可，API 路径为 `/api/alert`

## 5. 前端调用方式

POST `https://你的-vercel-域名/api/alert`

Body 示例：
```json
{
  "to": "收件人邮箱",
  "subject": "邮件主题",
  "text": "纯文本内容",
  "html": "<b>HTML内容</b>"
}
```

## 6. 注意事项
- Vercel 免费版有调用频率和资源限制，适合轻量级场景。
- 邮箱服务商需支持 SMTP 并允许第三方应用授权码。
- 不建议将敏感信息（如授权码）提交到 git。
