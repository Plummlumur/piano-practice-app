# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a piano practice tracking application built with:
- **Next.js 15** (App Router) with TypeScript
- **Prisma** for database ORM with PostgreSQL
- **Tailwind CSS** for styling
- **Lucide React** for icons

The main application is in `piano-practice-app/` with the root having shared dependencies.

## Database Schema

The application tracks:
- **Pieces**: Musical pieces with status (TRAINING/REPERTOIRE), play counts, and metadata
- **Exercises**: Practice exercises with last practiced tracking
- **Training Sessions**: Practice sessions linking exercises and pieces with duration tracking

Key relationships:
- Training sessions have many-to-many relationships with both exercises and pieces
- Pieces are categorized as either "new" (training) or "repertoire" within sessions
- The schema uses junction tables for complex many-to-many relationships

## Development Commands

Navigate to `piano-practice-app/` for all commands:

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run Next.js linting

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma studio       # Open Prisma Studio for database management
```

## API Architecture

RESTful API endpoints in `app/api/`:
- `/api/pieces` - Manage musical pieces (GET, POST)
- `/api/exercises` - Manage practice exercises (GET, POST)
- `/api/training-sessions` - Manage practice sessions with complex relationships (GET, POST)

All API routes use Prisma for database operations with proper error handling and JSON responses.

## Key Files

- `prisma/schema.prisma` - Database schema with enums and relationships
- `piano-practice-app/api.ts` - Client-side API functions
- `app/api/*/route.ts` - Server-side API route handlers
- `app/layout.tsx` - Root layout with Geist font configuration

## Environment Setup

Requires `DATABASE_URL` environment variable for PostgreSQL connection.