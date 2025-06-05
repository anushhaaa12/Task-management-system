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

FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
# Frontend will run on port 3000 (see frontend Dockerfile)
CMD ["npm", "run", "start"] 