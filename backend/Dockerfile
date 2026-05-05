# Use Node.js base image (match your version)
FROM node:22

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "app.js"]