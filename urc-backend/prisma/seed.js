const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 🔐 hash password
  const passwordHash = await bcrypt.hash("admin123", 10);

  // ✅ Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@urc.in" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        id: "admin_" + nanoid(10),
        name: "URC Admin",
        email: "admin@urc.in",
        passwordHash,
        regiment: "4213 URC NCC",
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },
    });

    console.log("✅ Admin user created");
  } else {
    console.log("⚠️ Admin already exists");
  }

  console.log("🌱 Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });