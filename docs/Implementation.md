# Implementation Plan for Gym Tracker

## Business Logic & Data Model

### Core Entities:

1. **Routines** - User-created workout plans that can contain up to 7 workouts
2. **Workouts** - Individual workout sessions within a routine (max 7 per routine)
3. **WorkoutExercises** - Exercises within a specific workout
4. **WorkoutExerciseSets** - Sets for each exercise in a workout
5. **Exercises** - Exercise templates/catalog

### Entity Relationships:

```
Routines (1) → (0-7) Workouts
Workouts (1) → (0-N) WorkoutExercises
WorkoutExercises (1) → (1-N) WorkoutExerciseSets
WorkoutExercises (N) → (1) Exercises
```

### Key Business Rules:

- Every routine can have a maximum of 7 workouts
- Every workout can have multiple workout exercises
- Every workout exercise must have at least one workout exercise set
- Every workout exercise is linked to an exercise from the exercise catalog
- Workouts can be scheduled on specific days of the week
- Workout sessions track actual performance during workouts

### Database Schema Structure:

#### Core Tables:

- **routines** - User workout plans
- **workouts** - Individual workouts within routines (max 7 per routine)
- **workout_exercises** - Exercises within specific workouts
- **workout_exercise_sets** - Sets for each exercise in a workout
- **exercises** - Exercise catalog/templates
- **workout_sessions** - Actual workout performance tracking
- **exercise_logs** - Exercise performance during sessions
- **set_logs** - Set performance during sessions

#### Key Constraints:

- Database constraint ensures maximum 7 workouts per routine
- Database constraint ensures workout exercises have at least one set
- Proper foreign key relationships with cascade deletes
- Indexes for optimal query performance

## Feature Analysis

### Identified Features:

1. **Routine Planning & Weekly Scheduling** - Users can create workout routines with up to 7 workouts and assign them to specific days using drag-and-drop functionality
2. **Daily Routine View (Homepage Preview)** - Homepage shows the scheduled workout for the current day with start/complete actions
3. **Workout Session Logging and Historical Records** - Automatic logging of workout sessions with historical comparison capabilities
4. **Last Weight Recall Per Exercise** - Display most recent weight used for each exercise to guide progression
5. **User Authentication** - Secure user registration and login system
6. **Exercise Management** - Create, edit, and manage exercise templates
7. **Progress Tracking** - Visual tracking of performance trends over time
8. **Data Persistence** - Reliable storage and retrieval of workout data
9. **Responsive Design** - Mobile-first responsive interface
10. **Real-time Updates** - Live data synchronization and optimistic updates

### Feature Categorization:

- **Must-Have Features:**
  - User Authentication
  - Routine Planning & Weekly Scheduling (with 7-workout limit)
  - Daily Workout View
  - Workout Session Logging and Historical Records
  - Last Weight Recall Per Exercise
  - Data Persistence
  - Responsive Design

- **Should-Have Features:**
  - Exercise Management
  - Progress Tracking
  - Real-time Updates
  - Form Validation
  - Error Handling

- **Nice-to-Have Features:**
  - Advanced Analytics
  - Export/Import functionality
  - Social Features
  - Workout Templates
  - Exercise Recommendations

## Recommended Tech Stack

### Frontend:

- **Framework:** Next.js 15 (App Router) - Modern React framework with excellent performance, SSR capabilities, and Server Actions for seamless client-server integration
- **Documentation:** https://nextjs.org/docs

### Server Actions Architecture:

- **Colocation Pattern:** Server Actions must be colocated with the pages that use them
- **File Structure:** Each page requiring actions should have its own `actions.ts` file in the same directory
- **Example Structure:**
  ```
  app/
  ├── auth/
  │   ├── login/
  │   │   ├── page.tsx
  │   │   └── actions.ts        # Login-specific actions
  │   └── register/
  │       ├── page.tsx
  │       └── actions.ts        # Registration-specific actions
  ├── dashboard/
  │   ├── page.tsx
  │   └── actions.ts            # Dashboard-specific actions
  └── routines/
      ├── page.tsx
      └── actions.ts            # Routine-specific actions
  ```
- **Benefits:** Better code organization, clearer dependencies, easier maintenance, and improved developer experience

### Error Handling Pattern:

- **Go-Style Error Handling:** Use tuple-based error handling pattern `[error, data]` for cleaner code
- **Utility Functions:**
  - `to(promise)` - Wraps async operations and returns `[error, data]` tuple
  - `toSync(fn)` - Wraps synchronous operations that might throw
- **Example Usage:**

  ```typescript
  import { to, toSync } from '@/lib/utils/error-handler';

  // Async operations
  const [error, user] = await to(auth.api.signInEmail(data));
  if (error) {
    return { error: error.message };
  }
  // user is safely available here

  // Synchronous operations (validation, parsing)
  const [validationError, validatedData] = toSync(() => schema.parse(data));
  if (validationError) {
    return { error: 'Invalid data' };
  }
  ```

- **Benefits:** Eliminates nested try-catch blocks, makes error handling explicit, reduces cognitive load

### Language:

- **Language:** TypeScript - Type safety, better developer experience, and excellent tooling support
- **Documentation:** https://www.typescriptlang.org/docs/

### State Management & Data Fetching:

- **Library:** TanStack Query v5 - Powerful data synchronization, caching, and background updates with excellent developer experience
- **Documentation:** https://tanstack.com/query/latest

### Database & ORM:

- **ORM:** Drizzle ORM - Type-safe, lightweight ORM with excellent TypeScript integration and SQL-first approach
- **Documentation:** https://orm.drizzle.team/
- **Database:** Supabase (PostgreSQL) - Managed PostgreSQL with real-time capabilities, authentication, and excellent developer experience
- **Documentation:** https://supabase.com/docs

### Authentication:

- **Framework:** BetterAuth - Modern, type-safe authentication framework with comprehensive features and plugin ecosystem
- **Documentation:** https://www.better-auth.com/docs/introduction

### UI & Styling:

- **Styling:** TailwindCSS - Utility-first CSS framework for rapid UI development
- **Documentation:** https://tailwindcss.com/docs
- **Components:** Shadcn UI - High-quality, accessible React components built with Radix UI and TailwindCSS
- **Documentation:** https://ui.shadcn.com/docs
- **Animation:** Framer Motion - Production-ready motion library for React applications
- **Documentation:** https://www.framer.com/motion/

### Development Tools:

- **Linting:** ESLint - Code quality and consistency
- **Documentation:** https://eslint.org/docs/latest/
- **Formatting:** Prettier - Code formatting and style consistency
- **Documentation:** https://prettier.io/docs/en/

### Additional Tools:

- **Validation:** Zod - TypeScript-first schema validation with static type inference
- **Documentation:** https://zod.dev/
- **Drag & Drop:** react-beautiful-dnd - Beautiful and accessible drag and drop for lists
- **Documentation:** https://github.com/atlassian/react-beautiful-dnd
- **Date Handling:** date-fns - Modern JavaScript date utility library
- **Documentation:** https://date-fns.org/docs/Getting-Started

## Implementation Stages

### Stage 1: Foundation & Setup

**Duration:** 1-2 weeks
**Dependencies:** None

#### Sub-steps:

- [x] Initialize Next.js 15 project with TypeScript and App Router
- [x] Set up development environment with ESLint, Prettier, and Git hooks
- [x] Configure TailwindCSS and install Shadcn UI components
- [x] Set up Supabase project and configure environment variables
- [x] Initialize Drizzle ORM with Supabase connection
- [x] Configure BetterAuth for authentication system
- [x] Set up TanStack Query with proper SSR configuration
- [x] Create basic project structure and core utilities
- [x] Set up database schema and initial migrations
- [x] Implement basic authentication flows (signup/signin/signout)

### Stage 2: Core Authentication & User Management

**Duration:** 1-2 weeks
**Dependencies:** Stage 1 completion

#### Sub-steps:

- [x] Implement user registration
- [x] Set up protected routes and authentication middleware
- [x] Create user profile management functionality
- [x] Implement password reset and change password flows
- [x] Set up session management with BetterAuth
- [x] Create authentication UI components (login, register, forgot password)
- [x] Implement proper error handling for authentication flows
- [x] Add form validation with Zod schemas
- [x] Test authentication flows across different devices
- [x] Set up proper TypeScript types for user and session data

### Stage 3: Database Design & Exercise Management

**Duration:** 1-2 weeks
**Dependencies:** Stage 2 completion

#### Sub-steps:

- [x] Design and implement core database schema (users, exercises, routines, workouts, workoutExercises, workoutExerciseSets, sessions)
- [x] Create exercise management system with CRUD operations
- [x] Implement exercise templates and categories
- [x] Create exercise search and filtering functionality
- [x] Refactor database schema to support workout-based structure
- [x] Update database queries to work with new workout-based structure
- [x] Update server actions and validation schemas for new workout-based structure
- [x] Update UI components to work with new workout-based structure
- [x] Apply database migration to create workout-based structure in Supabase
- [ ] Create routine builder with workout management (max 7 workouts per routine)
- [ ] Implement workout exercise assignment and set configuration
- [ ] Add workout scheduling and day assignment functionality

### Stage 4: Routine Planning & Weekly Scheduling

**Duration:** 2-3 weeks
**Dependencies:** Stage 3 completion

#### Sub-steps:

- [ ] Create routine builder with workout limit enforcement (max 7 workouts)
- [ ] Add workout templates and cloning functionality
- [ ] Create routine validation and error handling
- [ ] Implement workout scheduling logic with day assignment
- [ ] Add routine sharing and copying features
- [ ] Set up optimistic updates for routine changes
- [ ] Test drag-and-drop functionality across devices
- [ ] Implement workout reordering within routines

### Stage 5: Daily Workout View & Session Management

**Duration:** 2-3 weeks
**Dependencies:** Stage 4 completion

#### Sub-steps:

- [ ] Create homepage with today's scheduled workout display
- [ ] Implement "Start Workout" session mode
- [ ] Build workout exercise cards with expand/collapse functionality
- [ ] Implement weekly calendar/planner UI component showing scheduled workouts
- [ ] Set up drag-and-drop functionality with framer-motion for workout scheduling
- [ ] Implement rest timers and workout duration tracking
- [ ] Create session progress indicators and animations
- [ ] Add workout completion and summary screens
- [ ] Implement session pause/resume functionality
- [ ] Set up workout notes and feedback system
- [ ] Add empty state handling for days without scheduled workouts
- [ ] Implement workout exercise set tracking and logging

### Stage 6: Historical Records & Progress Tracking

**Duration:** 2-3 weeks
**Dependencies:** Stage 5 completion

#### Sub-steps:

- [ ] Implement workout session history storage and retrieval
- [ ] Create history view with filtering and sorting by routine/workout
- [ ] Build last weight recall system for exercises across workout sessions
- [ ] Implement performance comparison and progress tracking per exercise
- [ ] Add workout statistics and analytics
- [ ] Create progress charts and visualizations
- [ ] Implement data export functionality
- [ ] Add workout streak tracking
- [ ] Set up progress photos and measurements
- [ ] Create personal records (PR) tracking per exercise
- [ ] Implement routine completion tracking and statistics

### Stage 7: Advanced Features & Performance

**Duration:** 2-3 weeks
**Dependencies:** Stage 6 completion

#### Sub-steps:

- [ ] Implement advanced search and filtering
- [ ] Add workout plan templates and sharing
- [ ] Create social features (optional)
- [ ] Implement advanced analytics and insights
- [ ] Add workout recommendations based on history
- [ ] Optimize database queries and caching
- [ ] Implement progressive web app (PWA) features
- [ ] Add offline functionality with sync
- [ ] Set up advanced error monitoring
- [ ] Implement data backup and restore

### Stage 8: Polish, Testing & Deployment

**Duration:** 2-3 weeks
**Dependencies:** Stage 7 completion

#### Sub-steps:

- [ ] Conduct comprehensive testing (unit, integration, e2e)
- [ ] Optimize performance and Core Web Vitals
- [ ] Implement comprehensive error handling and user feedback
- [ ] Add loading states and skeleton screens
- [ ] Polish UI/UX with animations and micro-interactions
- [ ] Set up monitoring and analytics
- [ ] Configure production deployment pipeline
- [ ] Implement security best practices and audit
- [ ] Create user documentation and onboarding
- [ ] Prepare for production launch and monitoring

## Resource Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [BetterAuth Documentation](https://www.better-auth.com/docs/introduction)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Beautiful DnD Documentation](https://github.com/atlassian/react-beautiful-dnd)
- [Zod Documentation](https://zod.dev/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
