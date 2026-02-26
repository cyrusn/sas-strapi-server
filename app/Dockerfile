FROM node:16
# Installing libvips-dev for sharp Compatability
# RUN echo "deb http://security.debian.org/debian-security bullseye-security main contrib non-free" > /etc/apt/sources.list
# RUN apt-get update
# RUN apt-get --fix-broken install -y libvips-dev
ARG NODE_ENV development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY ./package.json ./yarn.lock ./
ENV PATH=/opt/node_modules/.bin:$PATH
RUN yarn config set network-timeout 600000 -g && yarn install
WORKDIR /opt/app
COPY ./ .
RUN yarn build
EXPOSE 1337
# Conditional CMD: yarn start for production, yarn develop otherwise
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then yarn start; else yarn develop; fi"]
