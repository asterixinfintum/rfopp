# Use the official Node.js 18 image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code into the container
COPY . .

# Set the environment variable for the port number
ENV PORT 8001

ENV MONGODB_URI mongodb://db:27017/db

# Inform Docker that the container is listening on the specified port at runtime
EXPOSE $PORT

# Run the application
CMD [ "node", "index.js" ]
