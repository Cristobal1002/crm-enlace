# Etapa de compilación
FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install -g @angular/cli
COPY . .
RUN npm run build -- --configuration=production

# Etapa de producción
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/front-crm/browser /usr/share/nginx/html
EXPOSE 80