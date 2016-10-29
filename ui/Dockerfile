FROM node:6

RUN npm install -g \
  babel-cli \
  babel-preset-latest \
  browser-sync \
  eslint \
  gulp \
  gulp-babel \
  gulp-pug \
  gulp-sass \
  html2jade \
  node-sass \
  nodemon \
  pug \
  pug-cli

WORKDIR /code
COPY package.json ./
RUN npm install -g

RUN useradd -r -u 1000 -d /tmp app
ENV NODE_PATH=/usr/local/lib/node_modules
EXPOSE 3001 8080

COPY ./ /code
RUN mkdir -p /dist && \
  chown -R app ./ /dist

USER app
RUN gulp build
CMD ["nodemon", "-x", "gulp serve", "-w", "/code/gulpfile.js"]
