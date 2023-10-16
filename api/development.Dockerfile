FROM node:16-alpine3.15

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./bin/boot-app-dev.sh

CMD ["/usr/src/api/bin/boot-app-dev.sh"]
