FROM node:18-alpine as base

WORKDIR /usr/src/app/server

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

# Development -----------------------
FROM base as dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]


# Testing / CI ----------------------
FROM base as test
RUN npm ci
COPY . .
CMD ["npm", "run", "test"]

# Production -----------------------
FROM base as prod
RUN npm ci --production
COPY . .
# Maybe redundant as "start" chain "build" command
RUN npm run build
CMD ["npm", "run", "start"]