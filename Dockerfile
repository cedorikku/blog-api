FROM node:22.21.1-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable && \
    corepack install --global pnpm@10.26.2 && \
    # Prisma may not work properly without this
    apt-get update && apt-get install -y openssl
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/dist

EXPOSE 5000

USER node

CMD ["pnpm", "start"]
