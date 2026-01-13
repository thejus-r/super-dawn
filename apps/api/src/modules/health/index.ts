import { Elysia } from "elysia";

export const healthModule = new Elysia({
  prefix: "/health",
}).get("/", () => {
  return Response.json(
    {
      status: "ok",
    },
    {
      status: 200,
    },
  );
});
