# This image will be based on the official nodejs docker image
FROM node:latest
 
# Commands will run in this directory
WORKDIR /home/app
 
# Install dependencies and generate production dist
RUN npm install -g gulp && npm install

# The command to run our app when the container is run
CMD ["npm", "start"]
