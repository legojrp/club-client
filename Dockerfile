FROM node

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build


FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
