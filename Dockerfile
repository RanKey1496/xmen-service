FROM node:12 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine
WORKDIR /app
COPY --from=build /app /app
CMD ["node", "dist/server.js"]