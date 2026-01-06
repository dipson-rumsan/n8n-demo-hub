# N8N Automation UI

A Next.js automation portal providing intelligent workflow solutions powered by n8n and AI.

## Features

- **🤖 AskBhunte AI Chatbot** - Facebook Messenger integration for market updates
- **📄 CV Evaluation & Scoring** - AI-powered resume analysis
- **📅 Sick Leave Management** - Automated leave processing with Google Sheets
- **🧾 Invoice Validation Portal** - Streamlined invoice processing

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Setup environment (copy and rename .env.example to .env):**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values.

3. **Run development server:**
   ```bash
   pnpm dev
   ```

## Environment Variables

Configure your `.env` file with:

```env
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS + Shadcn/UI
- N8N webhook integration

## Pages

- `/` - Main dashboard
- `/cvEvaluation` - CV evaluation portal
- `/sickLeave` - Leave management
- `/invoiceValidation` - Invoice processing

