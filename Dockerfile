## Builder: installs build deps, installs node modules and builds the project
FROM node:18-bullseye AS builder
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

## Runner: smaller final image with only runtime libs
FROM node:18-bullseye-slim AS runner
ENV NODE_ENV=production
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
