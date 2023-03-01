# base image
FROM node:lts

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get -qy update && apt-get -qy install openssl

# install dependencies
RUN yarn

RUN yarn add @prisma/client

COPY . .
RUN npx prisma generate --schema ./prisma/schema.prisma
RUN chmod +x startup.sh
# start app
RUN yarn build