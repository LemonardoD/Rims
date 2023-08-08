FROM node:19.8.1

WORKDIR /app

COPY "package.json" /app
COPY "tsconfig.json" /app
# Installs all packages
RUN npm install

COPY ./ ./

EXPOSE 3000
# Runs the dev npm script to build & start the server
CMD npm run start