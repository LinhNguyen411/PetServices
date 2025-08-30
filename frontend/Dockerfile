FROM node:20.14.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install @angular/cli@17.0.0
RUN npm install

COPY . .

EXPOSE 4200