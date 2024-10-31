# Use the official NGINX image from Docker Hub
FROM nginx:alpine

# Copy custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the dist folder to NGINX's default HTML location
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
