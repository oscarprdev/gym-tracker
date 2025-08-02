# Product Requirements Document (PRD)

## Product Name:

**Gym Tracker** – Web-based fitness tracker to create, manage, and visualize workout routines

---

## Objective

Develop a modern, intuitive, and responsive web-first application that empowers users to plan, execute, and track workout sessions with a clean, minimal interface. Users can create personalized routines, log exercise data (weights, reps, sets), and visually track performance trends over time. The long-term vision includes extending the platform to native mobile applications post-validation of the core web experience.

---

## Target Audience

- Fitness enthusiasts and gym-goers of all levels
- Personal trainers managing client routines
- Individuals focused on progressive overload and performance tracking

---

## Core Features (MVP) with Acceptance Criteria & Development Steps

> For each MVP feature below, we define **Acceptance Criteria** (AC) to confirm success, followed by **Development Steps** to guide implementation.

### 1. Routine Planning & Weekly Scheduling

**What:**
Users can create workout routines and assign them to specific days on a drag-and-drop weekly planner.

**Acceptance Criteria:**

1. The planner displays days Monday–Sunday with empty slots by default.
2. Users can drag an exercise template onto any day and configure sets, reps, rest, and weight.
3. Cloning or reusing a past routine populates the planner with correct data.
4. Attempting to assign an invalid exercise (e.g., missing sets) triggers a validation error.
5. Routines persist across page reloads and sessions.

**Development Steps:**

1. **UI Implementation**: Build a calendar grid using TailwindCSS; integrate `react-beautiful-dnd` for drag-and-drop.
2. **State Management**: Define routine schemas in TypeScript; manage local state with React Context until saved.
3. **Validation**: Use Zod to enforce required fields (sets > 0, reps > 0, weight ≥ 0).
4. **Persistence**: Create Supabase tables (`routines`, `routine_exercises`); implement Server Actions to create/update.
5. **Template Feature**: Query last week’s routines; build “Clone” button to prefill planner.
6. **Testing**: Write unit tests for schema validation; e2e tests (Cypress) for drag-and-drop and error handling.

---

### 2. Daily Routine View (Homepage Preview)

**What:**
The homepage shows the scheduled routine for the current day, allowing users to start, view, and mark exercises.

**Acceptance Criteria:**

1. On login or refresh, the homepage loads today’s routine automatically.
2. Each exercise card displays name, planned sets/reps, and last used weight.
3. Tapping “Start Workout” transitions into session mode.
4. Clicking an exercise expands details; clicking “Complete” marks it and triggers an animation.
5. If no routine is scheduled, the user sees a prompt to plan their week.

**Development Steps:**

1. **Data Fetching**: Use TanStack Query to fetch today’s routine via a Server Action (`getRoutineByDate`).
2. **UI Cards**: Create a `RoutineCard` component with Framer Motion for expand/collapse and completion animation.
3. **Session Mode**: Build a toggle to switch from preview to active session; persist progress locally.
4. **Empty State**: Design an informative empty state with a CTA to “Plan Routine”.
5. **Testing**: Snapshot tests for `RoutineCard`; integration tests for data fetching and session transition.

---

### 3. Routine Logging and Historical Records

**What:**
Every workout session automatically logs detailed entries (weights, reps, notes) for historical comparison.

**Acceptance Criteria:**

1. Entered data is saved in real time as the user logs sets and reps.
2. Historical sessions appear in a “History” tab with date, duration, and summary.
3. Editing an entry (e.g., correcting reps) updates the record immutably (versioned).
4. Deleting a session prompts confirmation and removes only that version.

**Development Steps:**

1. **Auto-Save Logic**: Implement debounced Server Actions to upsert session rows (`sessions`, `session_exercises`).
2. **History View**: Create a paginated “History” page; fetch with TanStack Query (`getSessions`, `getSessionDetails`).
3. **Versioning**: Add `version` column; on edit, insert a new version instead of modifying in place.
4. **Delete Flow**: Server Action for deletion; UI confirmation modal.
5. **Testing**: Unit tests for version logic; integration tests for auto-save and history listing.

---

### 4. Last Weight Recall Per Exercise

**What:**
Each exercise card shows the most recent weight used to guide users in setting new targets.

**Acceptance Criteria:**

1. On the planner and session views, each exercise displays “Last Used: X kg” if historical data exists.
2. If no history, display “No history” placeholder.
3. Weight difference (current minus last) displays as ± value once set.
4. Retrieval latency remains under 200ms.

**Development Steps:**

1. **Indexed Query**: Create a DB index on `(user_id, exercise_id, date DESC)`; build a Server Action (`getLastExerciseData`).
2. **UI Integration**: Extend `ExerciseRow` component to fetch and display last weight via TanStack Query hook.
3. **Delta Calculation**: Compute difference locally and display alongside input.
4. **Performance**: Monitor query times; add caching with React Query’s `staleTime`.
5. **Testing**: Mock historical responses; measure render times in storybook.

---

## Technology Stack

- **Framework:** Next.js (Server Actions)
- **Language:** TypeScript
- **State & Data:** TanStack Query
- **ORM:** Drizzle
- **Database:** Supabase
- **Auth:** BetterAuth
- **UI:** TailwindCSS + Shadcn UI + Framer Motion
- **Linting/Formatting:** ESLint & Prettier

---

## Development Roadmap

### Phase 1 – Web Application (MVP)

- Build all MVP features with above acceptance criteria and development steps.
- Conduct cross-browser and device testing.
- Launch private beta for user feedback.

### Phase 2 – Enhancements

- Implement charts, calendar overview, and gesture interactions.
- Plan mobile app development.

---

_End of PRD._
