# Use an official Node runtime as the base image
FROM node:22-alpine3.19

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE ${PORT}

# Define the command to run the app
CMD ["npm", "start"]