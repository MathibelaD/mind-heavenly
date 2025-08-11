# Mind Heavenly - AI-Powered Therapy Platform

A comprehensive, HIPAA/POPIA-compliant therapy platform built with Next.js and Supabase, featuring AI-powered support, video therapy sessions, and role-based dashboards for therapists, individual clients, and couples.

## Features

### 🔐 Authentication & Demo Accounts
- Supabase Auth with email/password login
- Pre-configured demo accounts for instant testing:
  - **Therapist**: `therapist@demo.com` / `Demo123!`
  - **Individual Client**: `client@demo.com` / `Demo123!`
  - **Couple Partner 1**: `partner1@demo.com` / `Demo123!`
  - **Couple Partner 2**: `partner2@demo.com` / `Demo123!`

### 🤖 AI-Powered Support
- OpenAI GPT-4o-mini integration via LangChain
- Real-time sentiment analysis and crisis detection
- Automatic escalation to therapist dashboards
- Personalized content recommendations

### 👨‍⚕️ Therapist Tools
- Comprehensive client management
- Session scheduling and calendar integration
- AI-generated session summaries
- Crisis alerts and escalation system

### 📅 Session Management
- Individual and couples therapy booking
- Timezone-aware scheduling
- WebRTC video/audio sessions
- Private chat and breakout rooms

### 💳 Payment Integration
- Stripe integration (test mode)
- Single and split payment support for couples
- Automated billing and invoicing

### 📚 Content Library
- Curated articles, meditations, and exercises
- Personalized content recommendations
- Progress tracking and favorites
- Role-based content filtering

### 🔒 Security & Compliance
- HIPAA/POPIA compliant data handling
- Row-level security (RLS) policies
- End-to-end encryption for sensitive data
- Comprehensive audit logging

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, Shadcn/UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI API with LangChain
- **Payments**: Stripe
- **Video**: WebRTC (planned: Agora/Twilio integration)
- **Hosting**: Vercel + Supabase

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (recommended) or npm
- Supabase CLI
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mind-heavenly
   ```

2. **Install dependencies**
   ```bash
   # Using the setup script (detects and uses pnpm or npm)
   pnpm run setup
   
   # Or directly with pnpm
   pnpm install
   
   # Or with npm if pnpm is not available
   npm install
   ```

3. **Set up Supabase locally**
   ```bash
   npx supabase start
   ```

4. **Configure environment variables**
   
   Create a `.env.local` file with the following:
   ```env
   # Supabase (use local values from `supabase start`)
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"

   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"

   # Stripe (test keys)
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

5. **Run database migrations**
   ```bash
   npx supabase db reset
   ```

6. **Seed the database with demo data**
   ```bash
   pnpm run db:seed
   ```

7. **Start the development server**
   ```bash
   pnpm run dev
   ```

8. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Use demo credentials to explore different user roles

### Demo Account Access

After seeding, you can log in with these demo accounts:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Therapist | `therapist@demo.com` | `Demo123!` | `/dashboard/therapist` |
| Individual Client | `client@demo.com` | `Demo123!` | `/dashboard/client` |
| Couple Partner 1 | `partner1@demo.com` | `Demo123!` | `/dashboard/couple` |
| Couple Partner 2 | `partner2@demo.com` | `Demo123!` | `/dashboard/couple` |

## Development

### Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Users**: Core user data with role-based access
- **Therapist Profiles**: Professional credentials and availability
- **Couples**: Relationship data for couples therapy
- **Therapy Sessions**: Scheduled sessions with video links
- **AI Conversations**: Chat history with sentiment analysis
- **Messages**: Encrypted communication between users
- **Content**: Educational resources and meditations
- **Payments**: Stripe integration for billing

### Scripts

#### Development
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run type-check` - Run TypeScript type checking

#### Database & Supabase
- `pnpm run db:seed` - Seed database with demo data
- `pnpm run supabase:start` - Start local Supabase
- `pnpm run supabase:stop` - Stop local Supabase
- `pnpm run supabase:reset` - Reset local database

#### Utilities
- `pnpm run setup` - Auto-detect and install dependencies
- `pnpm run clean` - Remove node_modules and lock files
- `pnpm run fresh-install` - Clean and reinstall dependencies
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting

### Architecture

```
src/
├── app/                    # Next.js app router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Shadcn/UI)
│   └── layout/           # Layout components
├── contexts/             # React contexts
├── lib/                  # Utilities and configurations
└── styles/              # Global styles

supabase/
├── migrations/          # Database migrations
└── config.toml         # Supabase configuration
```

## Deployment

### Production Setup

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set up Supabase project**
   - Create a new project on [supabase.com](https://supabase.com)
   - Run migrations: `supabase db push`
   - Seed data: `npm run db:seed`

3. **Configure environment variables**
   - Add all production environment variables to Vercel
   - Update Supabase Auth settings with production URLs

4. **Set up domain and SSL**
   - Configure custom domain in Vercel
   - Update Supabase Auth URLs

### Security Considerations

- All sensitive data is encrypted
- Row-level security policies protect user data
- HIPAA compliance measures implemented
- Regular security audits recommended
- Environment variables properly secured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [support@mindheavenly.com](mailto:support@mindheavenly.com) or create an issue in the repository.

---

**Note**: This is a demo application for educational purposes. For production use, ensure proper security audits, compliance reviews, and testing.