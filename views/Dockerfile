# build front-end
FROM node:lts-alpine AS frontend

# RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:1.25.1-alpine-slim AS final

RUN mkdir /app

COPY --from=frontend /app/dist /app

COPY nginx.conf.template /nginx.conf.template

EXPOSE 3002

ENTRYPOINT [ "/bin/sh", "-c", "envsubst '$BACKEND_URL' < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'" ]

# CMD ["pnpm", "run", "preview"]
