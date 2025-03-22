"use client";

import { z } from "zod";

const baseSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }).max(50),
});

export const signUpSchema = baseSchema.extend({
  username: z.string().min(1, { message: "Username is required" }).max(50),
});

export const signInSchema = baseSchema;
