# Fix Plan

## Issue 1: Frontend — `bookingsResult.value.data.data is undefined`
**File:** `project/src/App.tsx` (~line 1674)
- `fetchData()` accesses `bookingsResult.value.data.data.map(...)` without null-safety fallback.
- Same issue exists for users data.
- **Fix:** Add defensive fallback: `(bookingsResult.value.data?.data || bookingsResult.value.data || []).map(...)`

## Issue 2: Backend — `prepared statement "s3" does not exist` + userController crash
**Files:** `urc-backend/src/config/prisma.js`, `urc-backend/src/controllers/userController.js`
- PostgreSQL connection pooler (PgBouncer/Supabase) in transaction mode doesn't persist prepared statements across connections.
- Prisma default behavior uses prepared statements.
- **Fix A (prisma.js):** Append `pgbouncer=true` query param to the connection URL passed to PrismaClient, which tells Prisma to disable prepared statements.
- **Fix B (userController.js):** Wrap `getUsers` in try-catch so Prisma errors return 500 JSON instead of crashing the Node.js process.

## Steps
1. [x] Fix `project/src/App.tsx` — defensive data access for bookings & users.
2. [x] Fix `urc-backend/src/config/prisma.js` — add `pgbouncer=true` support.
3. [x] Fix `urc-backend/src/controllers/userController.js` — add try-catch to `getUsers`.
4. [x] Verify fixes compile/syntax is correct.

