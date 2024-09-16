FROM node:14-alpine

WORKDIR /app

RUN npm install -g pm2 && npm cache clean --force

RUN chown -R node:node /app

# Run container as non-root, this is highly recommended in production
# but requires deep knowledge about docker and how its volume works, otherwise it'll cause permission error
USER node

COPY --chown=node:node ["package.json", "package-lock.json*", "./"]

RUN npm install --silent && npm cache clean --force

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3004

CMD ["pm2-runtime", "ecosystem.config.js"]