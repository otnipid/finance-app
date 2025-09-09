# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the development server with hot-reload
CMD ["npm", "run", "dev"]
