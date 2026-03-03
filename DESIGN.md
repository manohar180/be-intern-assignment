# Design Documentation

## 1. Database Schema Design and Entity Relationships

I built the database around 5 main entities: User, Post, Like, Follow, and Hashtag.

**Users** are the core of the platform. Every other entity connects back to a user in some way.

**Posts** belong to a user. Each post has text content and tracks when it was created and updated. A user can have many posts but each post belongs to only one user (Many-to-One).

**Likes** connect a user to a post. A user can like many posts and a post can be liked by many users. I added a unique constraint on (userId, postId) so a user can't like the same post twice.

**Follows** connect two users together. The followerId is the person who follows and followingId is the person being followed. I added a unique constraint on (followerId, followingId) so you can't follow the same person twice. I also added a check in the controller to prevent users from following themselves.

**Hashtags** have a Many-to-Many relationship with Posts. A post can have many hashtags and a hashtag can belong to many posts. I used a junction table called post_hashtags to handle this relationship.

Here's how the tables relate to each other:
```
users
  ├── posts (one user → many posts)
  ├── likes (one user → many likes)
  └── follows (one user → many follows as follower or following)

posts
  ├── likes (one post → many likes)
  └── post_hashtags (many posts → many hashtags)

hashtags
  └── post_hashtags (many hashtags → many posts)
```

## 2. Indexing Strategy

I added indexes on columns that are frequently used in queries:

**posts table**
- Index on `userId` — because we often fetch posts by a specific user, especially in the feed endpoint

**likes table**
- Index on `userId` — for fetching all likes by a user in the activity endpoint
- Index on `postId` — for counting likes on a post

**follows table**
- Index on `followerId` — used in the feed to find who a user follows
- Index on `followingId` — used in the followers endpoint to find who follows a user

**hashtags table**
- Index on `name` — because hashtag search is case-insensitive and we search by name frequently

**Composite indexes (unique constraints that also act as indexes)**
- (userId, postId) on likes — prevents duplicate likes and speeds up duplicate checks
- (followerId, followingId) on follows — prevents duplicate follows and speeds up duplicate checks
- (postId, hashtagId) on post_hashtags — prevents duplicate hashtag assignments

The main idea behind my indexing decisions was to speed up the queries used in the special endpoints since those involve joining multiple tables together.

## 3. Scalability Considerations

**Pagination** — All endpoints that return lists support limit and offset parameters. This prevents loading too much data at once as the platform grows.

**Feed endpoint** — Currently the feed fetches posts from all followed users at once. If a user follows thousands of people this could get slow. A better approach for scale would be to pre-compute feeds and store them in a cache like Redis.

**Hashtag search** — Right now hashtags are stored as lowercase strings and searched by exact match. This works fine for now but with millions of hashtags a full-text search solution would be better.

**Database** — I used SQLite for this project which is great for development. For production with many concurrent users, switching to PostgreSQL or MySQL would handle load much better since they support concurrent writes.

**Activity endpoint** — Currently I fetch posts, likes and follows separately and merge them in memory. This works for small datasets but at scale it would be better to have a dedicated activity/events table that records all actions as they happen.

## 4. Other Design Considerations

**Validation** — I used Joi for input validation on all endpoints. This makes sure bad data never reaches the database and gives clear error messages back to the client.

**Cascading deletes** — I set up ON DELETE CASCADE on all foreign keys. This means if a user is deleted, all their posts, likes and follows are automatically cleaned up. Same for posts — if a post is deleted, all its likes and hashtag associations are removed.

**Migrations** — I used TypeORM migrations instead of synchronize:true. This gives better control over database changes and makes it safer to update the schema without accidentally losing data.

**Error handling** — Every controller function has try/catch blocks so unexpected errors return a clean JSON error message instead of crashing the server.

**Hashtag normalization** — Hashtag names are always saved in lowercase. So #Backend, #BACKEND and #backend all point to the same hashtag. This makes search more reliable.