FROM node:lts

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./

# RUN yarn install
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm","run","start"]
