import { Elysia } from "elysia";

export const createMembershipRouter = () => {
  return new Elysia()
    .get("/", () => {
      return {
        membership: []
      }
    })
}
