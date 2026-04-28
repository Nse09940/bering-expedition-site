FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps/docs/package.json apps/docs/package.json
RUN pnpm install

COPY . .
RUN pnpm --filter apps-docs build

EXPOSE 3001

CMD ["pnpm", "--filter", "apps-docs", "serve", "--host", "0.0.0.0", "--port", "3001"]
