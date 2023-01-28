FROM node:16 As builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

ENTRYPOINT ["npm", "run", "start:prod"]
