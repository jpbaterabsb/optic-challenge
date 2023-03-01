
FROM node:18

WORKDIR /usr/src/app/front

COPY package*.json ./

RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]