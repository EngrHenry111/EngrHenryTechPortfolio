"use server";

import crypto from "crypto";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { getCollection, parseForm } from "@/lib/admin-collections";
import { adminModels as models } from "@/lib/admin-models";

export async function login(prevState, formData) {
  if (!checkPassword(formData.get("password"))) {
    // Slow down password guessing.
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "Incorrect password." };
  }
  try {
    await createSession();
  } catch (err) {
    console.error(err);
    return { error: "Server setup problem: SESSION_SECRET is missing or shorter than 32 characters in Vercel's Environment Variables." };
  }
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

function errorRedirect(path, message) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function saveItem(key, id, formData) {
  await requireAdmin();
  const config = getCollection(key);
  if (!config) throw new Error(`Unknown collection: ${key}`);
  if (id && !mongoose.isValidObjectId(id)) throw new Error("Invalid id");

  const Model = models[key];
  const data = parseForm(config.fields, formData);
  const formPath = config.singleton ? `/admin/${key}` : id ? `/admin/${key}/${id}` : `/admin/${key}/new`;

  let failure = null;
  try {
    await connectDB();
    if (config.singleton) {
      await Model.findOneAndUpdate({}, data, { upsert: true, runValidators: true });
    } else if (id) {
      await Model.findByIdAndUpdate(id, data, { runValidators: true });
    } else {
      await Model.create(data);
    }
  } catch (err) {
    failure = err.message;
  }
  // redirect() throws, so it must run outside the try/catch.
  if (failure) errorRedirect(formPath, failure);

  revalidatePath("/");
  redirect(`/admin/${key}?saved=1`);
}

export async function deleteItem(key, id) {
  await requireAdmin();
  const config = getCollection(key);
  if (!config || config.singleton) throw new Error(`Cannot delete from: ${key}`);
  if (!mongoose.isValidObjectId(id)) throw new Error("Invalid id");

  await connectDB();
  await models[key].findByIdAndDelete(id);
  revalidatePath("/");
  redirect(`/admin/${key}?deleted=1`);
}

// Signs a direct browser-to-Cloudinary upload, so large images never pass
// through the Vercel function (which caps request bodies at 4.5 MB).
export async function getUploadSignature() {
  await requireAdmin();
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return { error: "Cloudinary keys are missing. Add them to .env.local / Vercel env vars." };
  }
  const folder = "portfolio";
  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest("hex");
  return { cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, folder, timestamp, signature };
}
