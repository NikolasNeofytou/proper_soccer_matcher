# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# Development dependencies stage
FROM base AS dev-dependencies
COPY package*.json ./
RUN npm install

# Build stage
FROM dev-dependencies AS build
COPY . .
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

# Development stage
FROM dev-dependencies AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
