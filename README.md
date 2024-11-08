# URL Keyword Analyzer

A powerful SEO analysis tool built with React and Vite.

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Stripe keys to the `.env` file:
```
VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
STRIPE_SECRET_KEY=your_secret_key_here
```

5. Start the development server:
```bash
npm run dev
```

## Features

- Keyword analysis
- Page structure analysis
- Topical authority mapping
- Subscription management with Stripe
- User authentication with Firebase

## Environment Variables

The following environment variables are required:

- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key (used in Netlify functions)

## Deployment

This project is configured for deployment on Netlify with serverless functions for Stripe integration.