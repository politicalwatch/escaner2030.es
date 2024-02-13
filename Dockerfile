FROM node:lts-stretch as build-stage

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . .

CMD npm run dev
