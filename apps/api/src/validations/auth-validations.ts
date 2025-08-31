import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type SignupDto = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SigninDto = z.infer<typeof loginSchema>