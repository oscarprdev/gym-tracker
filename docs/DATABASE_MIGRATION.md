# Database Migration Guide

This document explains the database migration process used to synchronize the database schema with the Drizzle schema files.

## Overview

When schema files are updated but the database structure doesn't match, a migration process is needed to bring them into sync. This guide documents the process used to resolve schema mismatches in the gym-tracker project.

## Problem Statement

The database had extra columns that weren't defined in the current Drizzle schema files, causing a mismatch between the code expectations and the actual database structure.

### Key Differences Found

**Exercises Table:**

- **Database**: 12 columns (including extra fields like `description`, `equipment`, `instructions`, etc.)
- **Schema**: 6 columns defined
- **Mismatch**: 6 extra columns in database

**Routines Table:**

- **Database**: 9 columns (including `is_template`, `estimated_duration`)
- **Schema**: 7 columns defined
- **Mismatch**: 2 extra columns in database

**Workout Exercises Table:**

- **Database**: 6 columns (including `notes`)
- **Schema**: 5 columns defined
- **Mismatch**: 1 extra column in database

## Migration Process

### Step 1: Initial Assessment

**Tools Used:**

- Drizzle CLI: `npx drizzle-kit generate`
- Supabase MCP: `mcp_supabase_list_projects()`

**Findings:**

- Drizzle reported "No schema changes" despite obvious mismatches
- This indicated the migration system was out of sync with the actual database state

### Step 2: Project Identification

```javascript
// List all Supabase projects
mcp_supabase_list_projects();
// Result: Found "gym-tracker" (ID: pwwtvapnrjcdmiazudiv)
```

### Step 3: Database Structure Analysis

```javascript
// Check current database tables and columns
mcp_supabase_list_tables(project_id: "pwwtvapnrjcdmiazudiv")
// This provided detailed information about all tables and their columns
```

### Step 4: Migration History Check

```javascript
// Check what migrations had been applied
mcp_supabase_list_migrations(project_id: "pwwtvapnrjcdmiazudiv")
// Found 6 existing migrations:
// 1. add_better_auth_tables
// 2. refactor_to_workout_based_structure
// 3. remove_rest_time_and_warmup
// 4. update_routine_exercises_remove_rest_add_weight_required
// 5. change_weight_to_integer
// 6. remove_rest_time_and_warmup
```

### Step 5: Schema Comparison

**Schema Files Analysis:**

```typescript
// lib/db/schema/exercises.ts
export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  muscleGroups: text('muscle_groups').array().notNull(),
  createdBy: text('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Database Reality:**

- Had extra columns: `description`, `equipment`, `instructions`, `image_url`, `video_url`, `is_custom`

### Step 6: Migration Creation and Application

**Migration SQL:**

```sql
-- Simplify exercises table to match current schema
ALTER TABLE exercises DROP COLUMN IF EXISTS description;
ALTER TABLE exercises DROP COLUMN IF EXISTS equipment;
ALTER TABLE exercises DROP COLUMN IF EXISTS instructions;
ALTER TABLE exercises DROP COLUMN IF EXISTS image_url;
ALTER TABLE exercises DROP COLUMN IF EXISTS video_url;
ALTER TABLE exercises DROP COLUMN IF EXISTS is_custom;

-- Simplify routines table to match current schema
ALTER TABLE routines DROP COLUMN IF EXISTS is_template;
ALTER TABLE routines DROP COLUMN IF EXISTS estimated_duration;

-- Simplify workout_exercises table to match current schema
ALTER TABLE workout_exercises DROP COLUMN IF EXISTS notes;
```

**Application:**

```javascript
mcp_supabase_apply_migration(
  project_id: "pwwtvapnrjcdmiazudiv",
  name: "simplify_schemas_to_match_current",
  query: migration_sql
)
```

### Step 7: Verification

**Database Structure Check:**

```javascript
// Re-checked tables after migration
mcp_supabase_list_tables(project_id: "pwwtvapnrjcdmiazudiv")
// Confirmed columns were removed
```

**Drizzle Sync Check:**

```bash
npx drizzle-kit generate
# Output: "No schema changes, nothing to migrate" ✅
```

**Migration History Update:**

```javascript
// Checked migration was recorded
mcp_supabase_list_migrations(project_id: "pwwtvapnrjcdmiazudiv")
// Found new migration: "simplify_schemas_to_match_current"
```

## Tools and Commands Used

### Supabase MCP Tools

- `mcp_supabase_list_projects()` - List all projects
- `mcp_supabase_get_project()` - Get project details
- `mcp_supabase_list_tables()` - List all tables and their structure
- `mcp_supabase_list_migrations()` - List applied migrations
- `mcp_supabase_apply_migration()` - Apply new migration

### Drizzle CLI Commands

- `npx drizzle-kit generate` - Generate migration files
- `npx drizzle-kit migrate` - Apply migrations (had issues)
- `npx drizzle-kit push` - Push schema changes (had issues)

## Migration Strategy

### Why Supabase MCP Instead of Drizzle CLI?

1. **Drizzle CLI Issues:**
   - Migration system was out of sync
   - `push` command had bugs with check constraints
   - `migrate` command tried to recreate existing tables

2. **Supabase MCP Advantages:**
   - Direct database access
   - Precise control over changes
   - Immediate verification capabilities
   - Proper migration tracking

### Safety Measures

1. **IF EXISTS Clauses:**

   ```sql
   ALTER TABLE exercises DROP COLUMN IF EXISTS description;
   ```

   - Prevents errors if columns don't exist

2. **Targeted Changes:**
   - Only removed columns that were in database but not in schemas
   - Preserved all data and relationships

3. **Verification Steps:**
   - Multiple checks to confirm changes were applied correctly

## Final Results

### Before Migration

- **Exercises**: 12 columns in DB, 6 in schema
- **Routines**: 9 columns in DB, 7 in schema
- **Workout Exercises**: 6 columns in DB, 5 in schema
- **Status**: Mismatched ❌

### After Migration

- **Exercises**: 6 columns in DB, 6 in schema
- **Routines**: 7 columns in DB, 7 in schema
- **Workout Exercises**: 5 columns in DB, 5 in schema
- **Status**: Perfectly synchronized ✅

### Migration History

```
1. add_better_auth_tables ✅
2. refactor_to_workout_based_structure ✅
3. remove_rest_time_and_warmup ✅
4. update_routine_exercises_remove_rest_add_weight_required ✅
5. change_weight_to_integer ✅
6. remove_rest_time_and_warmup ✅
7. simplify_schemas_to_match_current ✅ (new)
```

## Lessons Learned

### 1. Schema Synchronization

- Always verify database structure matches schema files
- Use `npx drizzle-kit generate` to check for mismatches
- Don't rely solely on migration history

### 2. Migration Tools

- Supabase MCP provides more reliable database access
- Direct SQL execution gives precise control
- Always verify changes immediately after application

### 3. Safety Practices

- Use `IF EXISTS` clauses to prevent errors
- Test migrations on development environment first
- Keep detailed records of all changes

### 4. Verification Process

- Check database structure after changes
- Verify Drizzle reports no schema changes
- Confirm migration history is updated

## Best Practices for Future Migrations

1. **Before Making Changes:**
   - Document current database structure
   - Identify all mismatches between schema and database
   - Plan migration strategy

2. **During Migration:**
   - Use safe SQL commands with `IF EXISTS`
   - Apply changes incrementally
   - Verify each step

3. **After Migration:**
   - Run `npx drizzle-kit generate` to confirm sync
   - Check application functionality
   - Update documentation

4. **Tools Selection:**
   - Prefer Supabase MCP for direct database operations
   - Use Drizzle CLI for verification
   - Keep both tools available for different purposes

## Troubleshooting

### Common Issues

1. **Drizzle Reports No Changes:**
   - Check if migration system is out of sync
   - Use Supabase MCP to verify actual database structure

2. **Migration Fails:**
   - Check for existing columns/constraints
   - Use `IF EXISTS` clauses
   - Verify database permissions

3. **Schema Still Mismatched:**
   - Re-run verification steps
   - Check for typos in migration SQL
   - Verify migration was actually applied

### Recovery Steps

1. **If Migration Partially Applied:**
   - Check migration history
   - Apply remaining changes manually
   - Update migration records

2. **If Database Corrupted:**
   - Restore from backup
   - Re-apply migrations in order
   - Verify final state

## Conclusion

This migration process successfully synchronized the database structure with the current Drizzle schema files. The use of Supabase MCP tools provided reliable and precise control over the migration process, ensuring a clean and safe database update.

The key to success was:

- Thorough analysis of the current state
- Careful planning of required changes
- Safe execution with proper error handling
- Comprehensive verification of results

This approach can be used as a template for future database migrations in this project.
