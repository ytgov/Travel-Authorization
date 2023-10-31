# State 0 - base node customizations
FROM node:16-alpine3.15 as base-node

RUN npm install -g npm@8.5.5

# Stage 1 - api build - requires development environment because typescript
FROM base-node as api-build-stage

ENV NODE_ENV=development

WORKDIR /usr/src/api

COPY api/package*.json ./
COPY api/tsconfig*.json ./
RUN npm install

COPY api ./

RUN npm run build

# State 2 - web build - requires development environment because typescript
FROM base-node as web-build-stage

ENV NODE_ENV=development

WORKDIR /usr/src/web

COPY web/package*.json ./
COPY web/tsconfig*.json ./
COPY web/babel.config.js ./
RUN npm install

COPY web ./

RUN npm run build:docker

# Stage 3 - production setup
FROM base-node

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENV NODE_ENV=production
USER node

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --from=api-build-stage --chown=node:node /usr/src/api/package*.json ./
RUN npm install && npm cache clean --force --loglevel=error

COPY --from=api-build-stage --chown=node:node /usr/src/api/dist ./dist
COPY --from=web-build-stage --chown=node:node /usr/src/web/dist ./dist/web

EXPOSE 3000

COPY --from=api-build-stage --chown=node:node /usr/src/api/bin/boot-app.sh ./bin/
RUN chmod +x ./bin/boot-app.sh

ENTRYPOINT ["./bin/boot-app.sh"]
