FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install

COPY . .
RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start", "--hostname", "0.0.0.0", "--port", "3000"]
