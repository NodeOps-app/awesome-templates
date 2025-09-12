# Awesome Templates - AI Prompt Directory

A Next.js application that provides a directory of AI prompts with an integrated chat interface powered by OpenAI-compatible APIs.

## Features

- **AI Prompt Directory**: Browse and explore various AI prompts organized by categories
- **Interactive Chat Interface**: Try prompts with real AI models
- **OpenAI API Integration**: Support for OpenAI and compatible APIs
- **Model Selection**: Choose from available models from your configured API
- **Persistent Chat History**: Chat sessions are saved in browser localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

### OpenAI API Setup

1. Click the "Configure" button in the top-right corner of the header
2. Read and acknowledge the security warning about API key storage
3. Enter your OpenAI API key and base URL
4. The default URL is `https://api.openai.com/v1` for OpenAI
5. For other compatible APIs, enter the appropriate base URL
6. Click "Save & Test" to verify the configuration

**⚠️ Security Notice**: Your API key will be stored in browser localStorage. Only use this application in trusted environments and never share your API key.

### Using the Chat Interface

1. Navigate to any prompt detail page
2. Select a model from the dropdown (if not configured, you'll see a message to configure first)
3. Start chatting with the AI using the selected prompt as context
4. Chat history is automatically saved and restored when you return to the page

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
