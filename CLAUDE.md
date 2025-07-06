# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a piano practice tracking application built with:
- **Next.js 15** (App Router) with TypeScript
- **Dual Database Architecture**:
  - **Prisma ORM** with PostgreSQL for practice tracking (pieces, exercises, sessions)
  - **Supabase** for instruments collection management
- **Tailwind CSS** for styling
- **Lucide React** for icons

The application is structured as a standard Next.js project in the root directory with integrated dual database support.

## Database Architecture

### Prisma + PostgreSQL (Primary Database)
The main practice tracking functionality uses Prisma with PostgreSQL:
- **Pieces**: Musical pieces with status (TRAINING/REPERTOIRE), play counts, and metadata
- **Exercises**: Practice exercises with last practiced tracking
- **Training Sessions**: Practice sessions linking exercises and pieces with duration tracking

Key relationships:
- Training sessions have many-to-many relationships with both exercises and pieces
- Pieces are categorized as either "new" (training) or "repertoire" within sessions
- The schema uses junction tables for complex many-to-many relationships

### Supabase (Secondary Database)
Instrument collection management uses Supabase:
- **Instruments**: Musical instruments with metadata (name, type, brand, model, acquisition date, notes)
- Server-side rendering support with SSR client
- Real-time capabilities for future enhancements

## Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run Next.js linting

# Prisma Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma studio       # Open Prisma Studio for database management

# Supabase
# Managed through Supabase Dashboard at https://supabase.com
```

## API Architecture

### Prisma-based Endpoints (Primary)
RESTful API endpoints in `app/api/` for practice tracking:
- `/api/pieces` - Manage musical pieces (GET, POST)
- `/api/exercises` - Manage practice exercises (GET, POST)
- `/api/training-sessions` - Manage practice sessions with complex relationships (GET, POST)

### Supabase-based Endpoints
- `/api/instruments` - Manage instrument collection (GET)

All API routes include proper error handling, type safety, and JSON responses. Prisma routes include comprehensive input validation.

## Key Files

### Database & API
- `prisma/schema.prisma` - Prisma database schema with enums and relationships
- `utils/supabase/server.ts` - Supabase server-side client configuration
- `api.ts` - Client-side API functions for both databases
- `app/api/*/route.ts` - Server-side API route handlers

### Components & Pages
- `app/page.tsx` - Main dashboard with tabbed navigation including instruments
- `app/instruments/page.tsx` - Dedicated instruments page (SSR)
- `app/components/InstrumentsView.tsx` - Instruments display component
- `app/layout.tsx` - Root layout with Geist font configuration

### Configuration
- `lib/types.ts` - TypeScript interfaces for API types
- `lib/validation.ts` - Input validation functions
- `lib/prisma.ts` - Prisma client singleton

## Environment Setup

### Required Environment Variables

**Prisma (PostgreSQL):**
- `DATABASE_URL` - PostgreSQL connection string

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

### Environment Files
- `.env.local` - Local development environment variables
- Production environment variables should be configured in Vercel dashboard

## Deployment

The application is configured for deployment on Vercel:
- `postinstall` script automatically generates Prisma client after dependency installation
- `build` script runs `prisma generate` before Next.js build to ensure fresh client
- `vercel.json` configures Next.js framework detection

For production deployment, ensure all environment variables are configured in Vercel:
- `DATABASE_URL` (PostgreSQL)
- `NEXT_PUBLIC_SUPABASE_URL` (Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase)

## Architecture Notes

### Database Strategy
The application uses a **dual database architecture** for separation of concerns:
- **Prisma + PostgreSQL**: Handles complex relational data for practice tracking with ACID compliance
- **Supabase**: Manages instruments collection with real-time capabilities and easy scaling

### Integration Approach
- Both databases are accessed through unified API layer
- Client-side components fetch from both sources seamlessly  
- Server-side rendering supported for Supabase data
- Type safety maintained across both database systems

### Future Considerations
- Consider consolidating to single database if complexity increases
- Supabase real-time features can be leveraged for live updates
- Both systems support scaling for larger datasets