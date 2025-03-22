# Use Node.js 23
FROM node:23

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Ensure module resolution is correct
ENV NODE_OPTIONS="--experimental-modules"

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
