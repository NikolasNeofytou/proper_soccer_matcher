# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm install

# Development stage
FROM dependencies AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Build stage
FROM dependencies AS build
COPY . .
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --production && npm cache clean --force
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
EXPOSE 3001
CMD ["npm", "run", "start"]
