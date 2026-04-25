const { PrismaClient } = require("@prisma/client");

// Append pgbouncer=true to the database URL so Prisma works correctly
// behind connection poolers (e.g., Supabase PgBouncer, Railway, etc.)
// that do not persist prepared statements across connections.
function getPooledUrl() {
  const raw = process.env.DATABASE_URL || "";
  if (!raw) return raw;
  if (raw.includes("pgbouncer=")) return raw;
  const separator = raw.includes("?") ? "&" : "?";
  return `${raw}${separator}pgbouncer=true`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getPooledUrl(),
    },
  },
});

module.exports = prisma;
