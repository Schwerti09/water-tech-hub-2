# HydroCore - Water Quality Monitoring Platform

## Overview

HydroCore is a German-language water quality analysis platform focused on the 2026 Trinkwasserverordnung (Drinking Water Regulation). The application provides PFAS contamination monitoring, water filter comparisons, and tenant legal rights information. Users can scan their postal code (PLZ) to get local water quality data, view an interactive PFAS radar map, compare water filtration products, and access a personal dashboard with scan history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for transitions
- **Maps**: React-Leaflet for PFAS radar visualization
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST endpoints under /api prefix
- **Build**: esbuild for production bundling with selective dependency bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: shared/schema.ts (shared between frontend and backend)
- **Migrations**: drizzle-kit with migrations output to ./migrations
- **Validation**: Zod schemas generated via drizzle-zod

### Authentication
- **Provider**: Replit OpenID Connect (OIDC)
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Strategy**: Passport.js with openid-client

### Key Design Patterns
- **Shared Types**: The shared/ directory contains schema definitions and route contracts used by both frontend and backend
- **Route Contracts**: API routes defined in shared/routes.ts with Zod validation schemas
- **Integration Modules**: Replit integrations (auth, chat, audio, image) are organized under server/replit_integrations/ and client/replit_integrations/

### Application Features
1. **Water Scanner** (Home): PLZ-based water quality lookup with contamination data
2. **PFAS Radar**: Interactive map showing PFAS hotspots across Germany
3. **Science Hub**: Water filter comparison with performance metrics
4. **Dashboard**: User-authenticated scan history and saved locations
5. **HydroAssistent**: AI voice/chat assistant for water quality questions

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Session Table**: `sessions` table for auth session storage
- **User Table**: `users` table for Replit Auth integration

### AI Services (via Replit AI Integrations)
- **OpenAI API**: Used for chat, voice, and image generation
- **Environment Variables**: AI_INTEGRATIONS_OPENAI_API_KEY, AI_INTEGRATIONS_OPENAI_BASE_URL

### Authentication
- **Replit OIDC**: Requires ISSUER_URL, REPL_ID, SESSION_SECRET environment variables

### Frontend Libraries
- **Leaflet**: Map tiles from CartoDB (light_all theme)
- **Google Fonts**: Inter, DM Sans, Outfit, Fira Code, Geist Mono

### Development Tools
- **Vite Plugins**: @replit/vite-plugin-runtime-error-modal, cartographer, dev-banner (dev only)