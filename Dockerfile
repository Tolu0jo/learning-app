FROM node:18 AS builder


WORKDIR /app

COPY package.json yarn.lock ./


RUN yarn install


COPY . .

RUN npx prisma generate


RUN yarn build


FROM node:18


WORKDIR /app


COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000


CMD ["node", "dist/main"]
