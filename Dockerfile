FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/apps/monit
WORKDIR /usr/src/apps/monit

# Install app dependencies
COPY package.json /usr/src/apps/monit
RUN npm install

# Bundle app source
COPY . /usr/src/apps/monit

CMD [ "npm", "start" ]
