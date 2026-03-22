require("dotenv").config();
const prisma = require("../config/prisma");
console.log("AUTH CONTROLLER - JWT_SECRET present:", !!process.env.JWT_SECRET, "length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_SECURE || "false") === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const defaultMailFrom = process.env.EMAIL_USER
  ? `"No Reply - URC NCC Canteen" <${process.env.EMAIL_USER}>`
  : '"No Reply - URC NCC Canteen"';

exports.register = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password, regiment } = req.body;

    if (!name || !email || !password || !regiment) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email exists" });

    const hash = await bcrypt.hash(password, 10);

    const userId = "u_" + nanoid(12);

    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        passwordHash: hash,
        regiment,
      },
    });

    console.log("USER CREATED:", user);

    res.json({ success: true, user });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ message: "User not active" });
    }

    const jwtSecret = process.env.JWT_SECRET || "__DEV_FALLBACK_SECRET__";
    const masked = jwtSecret ? `${jwtSecret.slice(0, 3)}...(${jwtSecret.length})` : "<none>";
    console.log("AUTH CONTROLLER - using JWT_SECRET:", masked);

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        regiment: user.regiment,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const genericMessage = "If that email exists, a reset link has been sent.";

    if (!user) {
      return res.json({ success: true, message: genericMessage });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const resetId = "pr_" + nanoid(12);
    const expiresAt = new Date(Date.now() + Number(process.env.RESET_TOKEN_EXPIRES_MINS || 30) * 60 * 1000);
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${baseUrl}/?resetToken=${encodeURIComponent(rawToken)}`;

    await prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    await prisma.passwordReset.create({
      data: {
        id: resetId,
        userId: user.id,
        token: rawToken,
        expiresAt,
      },
    });

    await mailTransport.sendMail({
      from: process.env.EMAIL_FROM || defaultMailFrom,
      to: user.email,
      subject: "Reset your URC NCC Canteen password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Reset your password</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#1F3D2B;color:#fff;text-decoration:none;border-radius:8px;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in ${process.env.RESET_TOKEN_EXPIRES_MINS || 30} minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
      text: `Reset your password using this link: ${resetUrl}`,
    });

    res.json({ success: true, message: genericMessage });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!passwordReset || passwordReset.used || passwordReset.expiresAt < new Date()) {
      return res.status(400).json({ message: "Reset link is invalid or expired" });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { passwordHash: hash },
    });

    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { used: true },
    });

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
