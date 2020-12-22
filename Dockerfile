FROM node:13-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=P@ssword

RUN mkdir -p /home/app

WORKDIR /home/app

# the docker build execute from parent folder
COPY package.json .
RUN npm install

# copy from local source folder to container WORKDIR
COPY ./src/ .

CMD ["node", "server.js"]
