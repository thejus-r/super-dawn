import z from "zod";

export const emailLoginSchema = z.object({
  email: z.email(),
  password: z.string()
})

export const emailRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string(),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  error: "Passwords do not match",
  path: [ "confirmPassword" ]
})

export type EmailLoginSchema = z.infer<typeof emailLoginSchema>
export type EmailRegisterSchema = z.infer<typeof emailRegisterSchema>
