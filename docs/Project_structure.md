# Project Structure

## Root Directory

```
gym-track/
├── app/                          # App Router: routes and pages
│   ├── (auth)/                   # Route group (authentication)
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts        # login server action
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   └── forgot-password/
│   │       ├── page.tsx
│   │       └── actions.ts
│   ├── (dashboard)/              # Route group (protected routes)
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # daily routine view
│   │   │   └── actions.ts
│   │   ├── routines/
│   │   │   ├── page.tsx          # routine planning
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── actions.ts
│   │   │   └── new/
│   │   │       ├── page.tsx
│   │   │       └── actions.ts
│   │   ├── history/
│   │   │   ├── page.tsx          # workout history
│   │   │   ├── [sessionId]/
│   │   │   │   └── page.tsx
│   │   │   └── actions.ts
│   │   ├── exercises/
│   │   │   ├── page.tsx          # exercise management
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── actions.ts
│   │   ├── workout/
│   │   │   ├── [routineId]/
│   │   │   │   ├── page.tsx      # active workout session
│   │   │   │   └── actions.ts
│   │   │   └── actions.ts
│   │   └── profile/
│   │       ├── page.tsx
│   │       └── actions.ts
│   ├── globals.css
│   ├── layout.tsx                # root layout
│   ├── page.tsx                  # landing page
│   ├── loading.tsx               # global loading UI
│   ├── error.tsx                 # global error UI
│   └── not-found.tsx             # 404 page
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn-based UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── calendar.tsx
│   │   └── index.ts              # component exports
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   ├── auth-guard.tsx
│   │   └── logout-button.tsx
│   ├── routine/                  # Routine-related components
│   │   ├── routine-builder.tsx
│   │   ├── routine-card.tsx
│   │   ├── routine-list.tsx
│   │   ├── weekly-planner.tsx
│   │   ├── drag-drop-exercise.tsx
│   │   └── routine-form.tsx
│   ├── exercise/                 # Exercise components
│   │   ├── exercise-card.tsx
│   │   ├── exercise-list.tsx
│   │   ├── exercise-form.tsx
│   │   ├── exercise-search.tsx
│   │   ├── exercise-selector.tsx
│   │   └── last-weight-display.tsx
│   ├── workout/                  # Workout session components
│   │   ├── workout-session.tsx
│   │   ├── exercise-tracker.tsx
│   │   ├── set-tracker.tsx
│   │   ├── rest-timer.tsx
│   │   ├── workout-summary.tsx
│   │   └── progress-indicator.tsx
│   ├── history/                  # History and analytics
│   │   ├── workout-history.tsx
│   │   ├── progress-chart.tsx
│   │   ├── statistics-card.tsx
│   │   └── history-filter.tsx
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── navigation.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── mobile-nav.tsx
│   └── common/                   # Common/shared components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       ├── confirmation-dialog.tsx
│       ├── empty-state.tsx
│       └── page-header.tsx
│
├── lib/                          # Core logic and utilities
│   ├── auth/                     # BetterAuth configuration
│   │   ├── auth.ts               # BetterAuth server config
│   │   ├── auth-client.ts        # BetterAuth client
│   │   └── middleware.ts         # Auth middleware
│   ├── db/                       # Database and ORM
│   │   ├── schema/               # Drizzle schema definitions
│   │   │   ├── users.ts
│   │   │   ├── exercises.ts
│   │   │   ├── routines.ts
│   │   │   ├── workout-sessions.ts
│   │   │   ├── sets.ts
│   │   │   └── index.ts
│   │   ├── client.ts             # Drizzle client (connected to Supabase)
│   │   ├── queries.ts            # Database query functions
│   │   └── migrations/           # Database migrations
│   │       └── 0001_initial.sql
│   ├── supabase/                 # Supabase configuration
│   │   ├── client.ts             # Supabase browser client
│   │   └── server.ts             # Supabase server client
│   ├── queries/                  # TanStack Query hooks and functions
│   │   ├── auth.ts               # Auth-related queries
│   │   ├── routines.ts           # Routine queries
│   │   ├── exercises.ts          # Exercise queries
│   │   ├── workouts.ts           # Workout session queries
│   │   ├── history.ts            # History queries
│   │   └── query-client.ts       # Query client configuration
│   ├── validations/              # Zod schemas for validation
│   │   ├── auth.ts               # Auth validation schemas
│   │   ├── routine.ts            # Routine validation schemas
│   │   ├── exercise.ts           # Exercise validation schemas
│   │   └── workout.ts            # Workout validation schemas
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # className utility (clsx + tailwind-merge)
│   │   ├── format.ts             # Date and number formatting
│   │   ├── constants.ts          # App constants
│   │   ├── types.ts              # Shared TypeScript types
│   │   ├── helpers.ts            # Helper functions
│   │   └── hooks.ts              # Custom React hooks
│   └── providers/                # React context providers
│       ├── query-provider.tsx    # TanStack Query provider
│       ├── auth-provider.tsx     # Authentication provider
│       └── theme-provider.tsx    # Theme provider
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── placeholder-exercise.jpg
│   │   └── icons/
│   ├── favicon.ico
│   └── manifest.json
│
├── styles/                       # Global styles and design tokens
│   ├── globals.css               # Global CSS and Tailwind imports
│   └── components.css            # Component-specific styles
│
├── config/                       # Configuration files
│   ├── env.ts                    # Environment variables with Zod validation
│   ├── site.ts                   # Site configuration and metadata
│   └── database.ts               # Database configuration
│
├── types/                        # TypeScript type definitions
│   ├── auth.ts                   # Authentication types
│   ├── database.ts               # Database-related types
│   ├── api.ts                    # API response types
│   └── global.d.ts               # Global type declarations
│
├── tests/                        # Test files
│   ├── __mocks__/                # Test mocks
│   ├── auth/                     # Auth tests
│   ├── components/               # Component tests
│   ├── utils/                    # Utility tests
│   └── setup.ts                  # Test setup configuration
│
├── docs/                         # Documentation
│   ├── Implementation.md         # Implementation plan
│   ├── Project_structure.md      # This file
│   ├── UI_UX_doc.md             # UI/UX documentation
│   └── API.md                    # API documentation
│
├── .env.local                    # Environment variables (local)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── tailwind.config.ts            # TailwindCSS configuration
├── next.config.mjs               # Next.js configuration
├── drizzle.config.ts             # Drizzle CLI configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── README.md                     # Project README
└── middleware.ts                 # Next.js middleware (for auth)
```

## Detailed Structure Explanation

### App Directory (`/app`)

The app directory follows Next.js 15 App Router conventions:

- **Route Groups**: `(auth)` and `(dashboard)` organize related routes without affecting the URL structure
- **Nested Routing**: Dynamic routes like `[id]` and `[routineId]` handle parameterized pages
- **Server Actions**: Each page that needs server-side logic has an accompanying `actions.ts` file
- **API Routes**: BetterAuth handler and webhook endpoints

### Components Directory (`/components`)

Organized by feature and functionality:

- **UI Components**: Shadcn UI components for consistent design system
- **Feature Components**: Grouped by domain (auth, routine, exercise, workout, history)
- **Layout Components**: Navigation, headers, and structural elements
- **Common Components**: Reusable utilities like loading states and error boundaries

### Lib Directory (`/lib`)

Contains core application logic:

- **Auth**: BetterAuth configuration for both server and client
- **Database**: Drizzle ORM schema, client, and query functions
- **Queries**: TanStack Query hooks organized by feature
- **Validations**: Zod schemas for type-safe validation
- **Utils**: Helper functions, types, and custom hooks
- **Providers**: React context providers for global state

### Configuration Files

- **Environment**: Type-safe environment variable handling with Zod
- **Site Config**: Centralized site metadata and configuration
- **Database Config**: Database connection and ORM settings

### File Naming Conventions

- **kebab-case**: For file and folder names
- **PascalCase**: For React components
- **camelCase**: For functions and variables
- **UPPER_SNAKE_CASE**: For constants and environment variables

### Key Patterns

1. **Colocation**: Related files are grouped together by feature
2. **Separation of Concerns**: Clear separation between UI, logic, and data layers
3. **Type Safety**: TypeScript types are centralized and exported from dedicated files
4. **Reusability**: Components and utilities are designed for maximum reuse
5. **Scalability**: Structure supports easy addition of new features

### Development Workflow

1. **Schema First**: Define database schema and types before UI implementation
2. **Component Driven**: Build UI components in isolation before integration
3. **Server Actions**: Use Next.js Server Actions for server-side operations
4. **Query Management**: TanStack Query for all client-server data synchronization
5. **Validation**: Zod schemas for both client and server-side validation

### Build and Deployment Structure

- **Static Assets**: Optimized and served from `/public`
- **Environment Management**: Separate configurations for development, staging, and production
- **Type Checking**: Full TypeScript coverage with strict mode
- **Code Quality**: ESLint and Prettier for consistent code standards
- **Testing**: Comprehensive test structure for different layers of the application
