# Drizzle ORM Relations Guide

This guide explains how to define and use table relations in Drizzle ORM, with practical examples and short descriptions for each feature.

---

## 1. What are Relations?

Relations in Drizzle ORM let you define how tables are connected (e.g., one-to-many, many-to-one). This enables you to fetch related data easily and efficiently, without writing manual SQL JOINs.

---

## 2. Defining Tables

```ts
import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
});
```

_Defines two tables: `users` and `posts`. Each post belongs to a user._

---

## 3. Declaring Relations

```ts
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts), // One user has many posts
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }), // Each post belongs to one user
}));
```

_Declares a one-to-many (user → posts) and many-to-one (post → user) relationship._

---

## 4. Querying with Relations

### Fetch a user and all their posts

```ts
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: true, // Fetch all related posts
  },
});
```

_Returns a user object with a `posts` array containing all their posts._

### Fetch a post and its author

```ts
const postWithUser = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    user: true, // Fetch the related user
  },
});
```

_Returns a post object with a `user` property containing the author._

---

## 5. Nested Relations

You can nest `with` to fetch deeply related data.

```ts
// Example: Blog with users, posts, and comments
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id),
  content: text('content').notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

// Query: Fetch a user, their posts, and each post's comments
const userWithPostsAndComments = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: {
      with: {
        comments: true,
      },
    },
  },
});
```

_Returns a user with posts, and each post includes its comments._

---

## 6. Filtering and Ordering Related Data

You can filter and order related data using `orderBy` and `where` inside `with`.

```ts
const userWithOrderedPosts = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: {
      orderBy: desc(posts.createdAt), // Order posts by creation date
    },
  },
});
```

_Fetches a user and their posts, ordered by creation date._

---

## 7. Real-World Example: Gym Tracker

```ts
// Fetch a routine with all workouts, each workout's exercises, and each exercise's sets
const routine = await db.query.routines.findFirst({
  where: eq(routines.id, routineId),
  with: {
    workouts: {
      with: {
        workoutExercises: {
          with: {
            exercise: true,
            sets: true,
          },
        },
      },
    },
  },
});
```

_Returns a routine with nested workouts, exercises, and sets, all in one query._

---

## 8. Benefits of Using Relations

- **Type-safe**: All related data is strongly typed.
- **Efficient**: Fetch deeply nested data in a single query.
- **Readable**: No manual JOINs or complex SQL.
- **Composable**: Easily extend queries with more relations.

---

## 9. References

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/relations)
- [Drizzle findMany API](https://orm.drizzle.team/docs/queries#findmany)
- [Drizzle with option](https://orm.drizzle.team/docs/relations#fetching-related-records)
