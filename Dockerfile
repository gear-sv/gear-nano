

FROM node:lts-slim
WORKDIR /mnt
COPY ./index.js /mnt/index.js
COPY ./transaction.js /mnt/transactions.js
COPY ./package.json /mnt/package.json
COPY ./a.out.js /mnt/a.out.js
COPY ./a.out.wasm /mnt/a.out.wasm
COPY ./state.js /mnt/state.js
#EXPOSE 3007
RUN echo start
RUN npm install --unsafe-perm
RUN echo done
ENTRYPOINT ["npm run start"]
