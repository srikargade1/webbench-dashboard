# Stage 1: Build the frontend
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json explicitly from correct subdirectory
COPY webbench-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY webbench-frontend/ ./

# Build the production version of the app
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Remove the default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build files from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
