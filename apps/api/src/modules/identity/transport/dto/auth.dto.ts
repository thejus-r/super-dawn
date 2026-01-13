import { z } from "zod"

const createUserWithEmailSchema = z.object({
  method: z.literal("email"),
  email: z.email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

const loginUserWithEmailSchema = z.object({
  method: z.literal("email"),
  email: z.email(),
  password: z.string(),
})

const loginUserWithTokenSchema = z.object({
  method: z.literal("google"),
  token: z.email()
})

const createUserWithTokenSchema = z.object({
  method: z.literal("google"),
  token: z.email()
})

export const createUserSchema = z.discriminatedUnion("method", [
  createUserWithEmailSchema,
  createUserWithTokenSchema
])

export const loginUserSchema = z.discriminatedUnion("method", [
  loginUserWithEmailSchema,
  loginUserWithTokenSchema
])

export type CreateUserInput = z.Infer<typeof createUserSchema>
export type LoginUserInput = z.Infer<typeof loginUserSchema>
