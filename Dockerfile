FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN echo "minimum-release-age=0" > .npmrc \
  && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build \
  && pnpm prune --prod

FROM base AS production
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
EXPOSE 3001
ENTRYPOINT ["./docker-entrypoint.sh"]
