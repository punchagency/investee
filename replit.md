# Investee - AI-Driven Real Estate Investment Platform

## Overview

Investee is a full-stack commercial real estate investment platform that enables investors to search properties, analyze deals using DSCR and Fix & Flip calculators, and apply for loans from multiple lenders through a unified marketplace. The platform features an AI chatbot for investor guidance, automated quote generation, and document upload capabilities for loan applications.

The application follows a monorepo structure with a React frontend (Vite + TypeScript), Express backend, and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for UI transitions
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Pattern**: RESTful endpoints under `/api/*` prefix
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Validation**: Zod with drizzle-zod for type-safe database schemas

### Data Storage
- **Primary Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with push-based migrations (`db:push` command)
- **Schema Location**: `shared/schema.ts` contains all table definitions

### Key Data Models
- **Loan Applications**: Tracks investor loan requests with property details, borrower info, credit scores, document uploads, and application status

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui based)
│   │   ├── pages/        # Route page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and API clients
│   │   └── services/     # External service integrations
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Drizzle migration files
```

### Build & Development
- **Development**: `npm run dev` runs the Express server with Vite middleware for HMR
- **Production Build**: `npm run build` bundles client with Vite and server with esbuild
- **Database Sync**: `npm run db:push` pushes schema changes to PostgreSQL

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL**: Primary data store (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management

### UI Component Libraries
- **shadcn/ui**: Pre-built accessible components using Radix UI primitives
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library

### API Integrations (Planned/Mock)
- **ATTOM API**: Property data service for real estate information (currently mocked in `client/src/services/attom.ts`)
- **AI/LLM Integration**: Chatbot functionality (currently uses mock responses, designed for OpenAI or Google Generative AI integration)

### Third-Party Services
- **Replit Plugins**: Dev banner, cartographer, and runtime error overlay for Replit environment
- **Google Fonts**: Poppins font family for typography

### Branding
- **Primary Color**: #1C49A6 (blue)
- **Accent Color**: #99C054 (green)
- **Font**: Poppins (all weights from 300-800)