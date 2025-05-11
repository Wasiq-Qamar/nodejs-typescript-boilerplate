FROM node:18.17.0
WORKDIR /usr/app
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run compile

EXPOSE 4000

CMD ["npm", "start"]