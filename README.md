# Luma Vendor Dashboard

A modern vendor management dashboard for Luma POS system, built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

This application provides vendors with a comprehensive dashboard to manage their Luma POS operations including:
- Sales tracking and analytics
- Subscription management
- User management
- Mobile app customization
- Product/menu management
- Real-time order tracking

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Radix UI
- **Authentication:** AWS Cognito (coming soon)
- **Payments:** Stripe
- **State Management:** Zustand
- **API Client:** SWR
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS account (for Cognito)
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/Luma-Vendor.git
cd Luma-Vendor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:
- AWS Cognito credentials
- Stripe API keys
- Database connection string
- Redis URL
- Other service credentials

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3335`.

## Available Scripts

- `npm run dev` - Start development server on port 3335
- `npm run build` - Build for production
- `npm start` - Start production server on port 3335
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Dashboard home page
│   └── globals.css      # Global styles and theme
├── components/          
│   ├── layout/          # Layout components (sidebar, dashboard wrapper)
│   ├── providers/       # Context providers (theme, auth)
│   └── ui/              # Reusable UI components
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## Features

### 🎨 Theme System
- Light and dark mode support
- System preference detection
- Smooth theme transitions
- Modern POS-inspired design

### 📊 Dashboard
- Real-time sales metrics
- Order tracking
- Customer analytics
- Product performance

### 🛠️ App Designer
- Visual layout customization
- Template selection
- Brand customization
- Preview functionality

### 💳 Subscription Management
- Plan selection
- Payment method management
- Usage tracking
- Invoice history

### 👥 User Management
- Role-based access control
- Employee management
- Permission settings
- Activity logs

## Environment Variables

The application uses different environment files for various stages:

- `.env.local` - Local development
- `.env.dev` - Development/staging server
- `.env.prod` - Production server
- `.env.example` - Example template

Key environment variables:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3335
NEXT_PUBLIC_API_URL=http://localhost:3000

# AWS Cognito
NEXT_PUBLIC_AWS_REGION=us-west-2
NEXT_PUBLIC_AWS_USER_POOL_ID=
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Database
DATABASE_URL=
```

## Development

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting (optional)
- TypeScript for type safety

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript types
- Follow the existing component structure
- Use Tailwind CSS for styling

### State Management

- Local state: React hooks
- Global state: Zustand (for complex state)
- Server state: SWR for data fetching

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Support

Coming soon...

### Deployment Platforms

Recommended platforms:
- Vercel (optimized for Next.js)
- AWS Amplify
- Google Cloud Run
- Any Node.js hosting service

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software for Luma POS.

## Support

For support, email support@lumapos.com or join our Slack channel.

---

Built with ❤️ by the Luma Team