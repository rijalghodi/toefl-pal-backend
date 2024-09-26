# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files first (this allows for better caching of dependencies)
COPY package*.json ./

# Install only the necessary dependencies (including NestJS)
RUN yarn install

# Copy the entire project files
COPY . .

# Install NestJS CLI globally to use it for the build
RUN yarn global add @nestjs/cli

# Build the NestJS application
RUN yarn build

# ----------------------------------------------------- #

# Stage 2: Create the production image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only package.json and yarn.lock files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN yarn install --production

# Copy the build files from the build stage
COPY --from=build /app/dist ./dist

# Copy any other necessary files (like static assets or configs if needed)
# COPY --from=build /app/static ./static

EXPOSE 8000

# Set the startup command for the production container
CMD ["yarn", "start:prod"]
