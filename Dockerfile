# Use the official NGINX image from Docker Hub
FROM nginx:alpine

# Install tzdata to set the timezone
RUN apk update && apk add --no-cache tzdata

# Set the timezone to Asia/Ho_Chi_Minh (UTC+7)
RUN cp /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && \
    echo "Asia/Ho_Chi_Minh" > /etc/timezone

# Remove tzdata to keep the image small
RUN apk del tzdata

# Copy custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the dist folder to NGINX's default HTML location
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
