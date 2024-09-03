# FROM node:alpine

# WORKDIR /usr/src/app

# COPY . /usr/src/app

# RUN npm install -g @angular/cli

# RUN npm install

# EXPOSE 4200
# CMD ["ng", "serve", "--host", "0.0.0.0"]
# Stage 1: Build Angular app
FROM node:alpine as build

WORKDIR /usr/src/app

COPY . .

RUN npm install -g @angular/cli
RUN npm install
RUN ng build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html
COPY ssl /etc/nginx/ssl

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
