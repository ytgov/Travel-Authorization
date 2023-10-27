FROM node:16-alpine3.15

WORKDIR /usr/src/web

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
