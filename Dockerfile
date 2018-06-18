FROM nodesource/node:6.3.1

WORKDIR /app

# Copy package.json file
ADD package.json package.json

#  Install node_modules
RUN npm install

# Copy application's folders and files
COPY app.js app.js
COPY ./api ./api
COPY ./config ./config
COPY ./assets ./assets
COPY ./tasks ./tasks
COPY ./views ./views

RUN mkdir .tmp
RUN chmod +x .tmp

EXPOSE 1337
CMD ["npm", "start"]