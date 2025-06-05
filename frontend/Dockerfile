# Use official Node.js image for build
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install && npm run build

# Use Nginx to serve the build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 