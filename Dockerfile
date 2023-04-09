# Setup
FROM node:16

WORKDIR /home/node/app
COPY . .

EXPOSE 3000/tcp

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Run
#ENTRYPOINT npm run dev
RUN npm run build
ENTRYPOINT npm run start
