FROM node:lts-alpine3.20 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
RUN npm install react-scripts@5.0.1 -g --silent
COPY . ./
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
RUN sed -i "s/process.env.REACT_APP_BACKEND_URL/\"$REACT_APP_BACKEND_URL\"/g" ./src/App.tsx
RUN npm run build

# production environment
FROM nginx:1.27.0
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
RUN chown -R nginx /var/cache/nginx/ /var/run/ /usr/share/nginx/html
USER nginx
CMD ["nginx", "-g", "daemon off;"]

