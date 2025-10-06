# Use Node 21.7.3 as the base image
FROM node:21.7.3-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (for caching dependencies)
COPY package*.json ./

# Install all dependencies (including dev deps)
RUN npm ci

# Copy source code
COPY . .

# Expose the default Vite/Vue dev server port (usually 5173)
EXPOSE 5173

# Start the development server
# --host 0.0.0.0 allows access from outside the container (for browser)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
