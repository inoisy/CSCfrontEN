FROM node:11.1.0-alpine

WORKDIR /usr/src/api

RUN echo "unsafe-perm = true" >> ~/.npmrc

# COPY package.json package-lock.json ./
RUN cd /usr/src/api

COPY package*.json /usr/src/api/

RUN npm install

COPY . .

RUN npm run build

COPY healthcheck.js ./

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s \
    CMD node /usr/src/api/healthcheck.js

ENV HOST 0.0.0.0

ENV PORT 80

EXPOSE 80

CMD ["npm", "start"]