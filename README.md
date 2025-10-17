# SOS Email - Vercel 部署指南

这个仓库提供一个 Vercel Serverless API：`/api/alert`，用于通过 SMTP 发送邮件（基于 nodemailer）。

## 目录结构
- `api/alert.js`：Serverless Function（Node.js 18+）
- `package.json`（根）：依赖声明（Vercel 会在根安装依赖）
- `.env.example`：环境变量示例（本地开发使用）

## 环境变量
在 Vercel 项目的 Project Settings -> Environment Variables 中配置：
- `SMTP_HOST`：SMTP 服务器（如 smtp.gmail.com）
- `SMTP_PORT`：465（SSL）或 587（STARTTLS）
- `SMTP_SECURE`：是否 SSL，465 用 `true`，587 用 `false`
- `SMTP_USER`：SMTP 用户名（邮箱）
- `SMTP_PASS`：SMTP 密码/应用专用密码
- `SMTP_FROM`：发件人（可选，默认用 `SMTP_USER`）
- `TOTP_SECRET`：接口防刷用的 TOTP 密钥，所有请求都需带 token 字段并通过校验

可复制 `.env.example` 为 `.env` 供本地运行 `vercel dev` 时读取（注意不要把 `.env` 提交到仓库）。

## 部署方式一：Vercel 控制台
1. 将本仓库推送到你的 GitHub/GitLab/Bitbucket
2. 打开 https://vercel.com/import 并选择该仓库
3. Framework 选择「Other」或保持默认
4. 设置上面的环境变量
5. 点击 Deploy

成功后得到域名，如 `https://<project>.vercel.app`，接口地址：
- `POST https://<project>.vercel.app/api/alert`

请求体示例（JSON）：
```
{
  "to": "someone@example.com",
  "subject": "Test",
  "text": "Hello",
  "html": "<b>Hello</b>"
}
```

## 部署方式二：Vercel CLI（Windows PowerShell）
前置：已安装 Node.js 18+。

安装并登录：
```powershell
npm i -g vercel
vercel login
```

首次部署并创建项目：
```powershell
# 在仓库根目录执行
vercel
```

绑定已有线上项目（若已创建过）：
```powershell
vercel link
```

（可选）用 CLI 添加环境变量（也可在网页控制台添加）：
```powershell
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_SECURE production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add SMTP_FROM production
```

部署到预览：
```powershell
vercel deploy
```

推广到生产：
```powershell
vercel deploy --prod
```

## 本地开发与测试
1) 使用 Vercel 本地开发（会读取 `.env.local`/`.env`）：
```powershell
vercel dev
```

2) 用 PowerShell 发送请求测试：
```powershell
$body = @{ to = "someone@example.com"; subject = "Test"; text = "Hello" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/alert" -Body $body -ContentType "application/json"
```

## 常见问题
- 405 Method Not Allowed：请使用 POST 请求
- 400 Missing required fields：确保 body 中含 `to`、`subject`，以及 `text` 或 `html` 至少一个
- 500 错误：多为 SMTP 认证/网络问题，检查环境变量与 SMTP 服务商的限制（开启应用专用密码、允许第三方客户端等）

## 安全建议
- 切勿把 SMTP 凭据提交到仓库；仅在 Vercel 环境变量里配置
- 使用 Gmail/Outlook 等服务时，建议启用应用专用密码
