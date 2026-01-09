import { z } from "zod"
import { t } from "elysia"

const createUserWithEmailSchema = z.object({
  method: z.literal("email"),
  email: z.email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

const createUserWithTokenSchema = z.object({
  method: z.literal("google"),
  token: z.email()
})

export const createUserSchema = z.discriminatedUnion("method", [
  createUserWithEmailSchema,
  createUserWithTokenSchema
])


export type CreateUserInput = z.Infer<typeof createUserSchema>
