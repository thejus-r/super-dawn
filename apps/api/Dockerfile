FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS pruner
WORKDIR /app

RUN bun install -g turbo
COPY . .

RUN turbo prune --scope=@superdawn/api --docker

FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock

RUN bun install --frozen-lockfile

FROM base AS runner
WORKDIR /app

COPY --from=pruner /app/out/full/ .
COPY --from=installer /app .

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["bun", "run", "start"]
