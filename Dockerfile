FROM node

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build


FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN npm install -g serve
CMD ['serve' '-s', 'build']
