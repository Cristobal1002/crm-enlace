# Etapa de compilación
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Etapa de producción
FROM nginx:alpine
COPY --from=build /app/dist/front-crm /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]