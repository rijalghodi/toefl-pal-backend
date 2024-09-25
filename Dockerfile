FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package*.json ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the app
RUN yarn build

#------------------------------------------------------------------------------

# Use a separate, smaller image for the final build
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files for production
COPY package*.json ./
RUN yarn install --production --frozen-lockfile

# Copy built assets from the build stage
COPY --from=build /app/dist ./dist

# Define the command to run the app
CMD ["yarn", "start:prod"]
