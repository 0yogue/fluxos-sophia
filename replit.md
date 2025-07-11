# Sales Dashboard Application

## Overview

This is a sales performance dashboard application built with React and Express.js that provides comprehensive analytics for sales teams. The application follows a three-layer dashboard architecture: Overview (Cockpit), Leaderboard (Individual Analysis), and Coaching (Qualitative Analysis). It's designed to help sales managers track team performance, identify top performers, and provide coaching insights based on conversation analysis.

The dashboard features a comprehensive dark mode theme with toggle functionality, matching the design aesthetic shown in the user's reference image.

**Current Architecture**: React + Vite + Express.js (separate frontend/backend)
**User Request**: Convert to Next.js with App Router (full-stack framework)

## Recent Changes

- 2025-01-11: Implemented dark mode theme system with toggle
- 2025-01-11: Added comprehensive hero section with explanatory content
- 2025-01-11: User requested Next.js conversion - started creating Next.js structure
- 2025-01-11: Created initial Next.js files (app/, providers/, lib/storage.ts) but keeping current React+Vite for now

## User Preferences

Preferred communication style: Simple, everyday language.
Theme preference: Dark mode option available with toggle button.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API design
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite integration

### Key Components

#### Dashboard Layers
1. **Overview Layer**: High-level KPIs and team performance metrics
2. **Leaderboard Layer**: Individual salesperson performance comparison
3. **Coaching Layer**: Detailed conversation analysis and quality assessment

#### Data Models
- **Salespeople**: User profiles with contact information and status
- **Conversations**: Sales interactions with timestamps, outcomes, and analysis
- **Script Steps**: Tracked adherence to sales scripts and processes

## Data Flow

### Client-Server Communication
1. Frontend makes API requests to Express server endpoints
2. Server processes requests and interacts with PostgreSQL database via Drizzle ORM
3. Real-time updates through periodic polling (30-second intervals)
4. Data transformation and formatting handled on both client and server sides

### Performance Metrics Pipeline
1. Raw conversation data stored in database
2. LLM analysis performed on conversations for script compliance and sentiment
3. Aggregated metrics calculated for dashboard display
4. Filtering and time-based queries for performance analysis

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components
- **recharts**: Chart visualization library
- **wouter**: Minimal routing library

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing and optimization

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `drizzle-kit push`

### Environment Configuration
- **Development**: Local development with hot reload
- **Production**: Node.js server serving both API and static files
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### File Structure
```
/client          # React frontend application
/server          # Express.js backend API
/shared          # Shared TypeScript types and schemas
/components.json # shadcn/ui configuration
/drizzle.config.ts # Database configuration
/vite.config.ts  # Frontend build configuration
```

### Key Features
- **Real-time Analytics**: Live performance metrics with auto-refresh
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Performance Optimization**: Code splitting and lazy loading
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Accessibility**: ARIA-compliant components via Radix UI

The application is designed to be deployed on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases.