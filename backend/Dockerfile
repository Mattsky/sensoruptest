FROM node:lts-alpine3.20
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
ARG EXPRESS_PORT
ENV EXPRESS_PORT=${EXPRESS_PORT}
RUN sed -i "s/PORT/$EXPRESS_PORT/g" ./src/index.js
USER node
CMD [ "node", "./src/index.js" ]


