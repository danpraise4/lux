/**
 * Seeds or updates one Admin user. Password is always bcrypt-hashed (12 rounds) before storage —
 * never store plaintext (same rounds as credential auth + password reset).
 *
 * Usage (from repo root):
 *   SEED_ADMIN_PASSWORD='your-password' npm run seed:admin
 *
 * Optional: SEED_ADMIN_EMAIL (default admin@nmaluxe.com.ng), SEED_ADMIN_NAME
 */
import "dotenv/config";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Admin from "../models/Admin";
import { connectDB, isDbConfigured } from "../lib/mongodb";

const DEFAULT_EMAIL = "admin@nmaluxe.com.ng";
const DEFAULT_NAME = "NMA Luxe Administrator";

async function main() {
  if (!isDbConfigured()) {
    console.error("MONGODB_URI is not set (.env)");
    process.exit(1);
  }

  const password = process.env.SEED_ADMIN_PASSWORD?.trim();
  if (!password) {
    console.error("Set SEED_ADMIN_PASSWORD when running seed (plaintext is hashed and not saved to the repo).");
    process.exit(1);
  }

  const email = (process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() || DEFAULT_EMAIL).toLowerCase();
  const name = (process.env.SEED_ADMIN_NAME?.trim() || DEFAULT_NAME).trim();

  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);

  const doc = await Admin.findOneAndUpdate(
    { email },
    {
      $set: { email, name, passwordHash },
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${doc.email} (${doc.name}), password stored as bcrypt hash only.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
