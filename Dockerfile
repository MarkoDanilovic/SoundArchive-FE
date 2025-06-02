# Step 1: Build the Angular app in a Node container
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Angular project files
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Step 2: Serve the Angular app using NGINX
FROM nginx:alpine

# Copy the build output to the NGINX server's public folder
COPY --from=build /app/dist/client /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
