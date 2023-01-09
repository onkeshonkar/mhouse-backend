FROM node:16-alpine
WORKDIR /usr/app

COPY . .
RUN yarn --frozen-lockfile

EXPOSE 4000

CMD ["yarn", "start"]
