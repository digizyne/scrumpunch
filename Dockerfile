FROM node:23.5.0 AS development
RUN mkdir /app
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./

FROM development AS build
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:23.5.0 AS production
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/.output /app/.output
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT [ "node" ]
CMD [ "/app/.output/server/index.mjs" ]
