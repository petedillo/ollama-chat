# Build stage
FROM --platform=$BUILDPLATFORM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Define ARG for environment variables.
ARG VITE_API_BASE_URL

# Set the ARG as environment variable
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the app
RUN npm run build

# Production stage
FROM --platform=$TARGETPLATFORM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]