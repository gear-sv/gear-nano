

FROM node:lts-slim
RUN apt-get update -y && apt-get install git bzip2 -y
WORKDIR /mnt
COPY ./index.js /mnt/index.js
COPY ./package.json /mnt/package.json
COPY ./a.out.js /mnt/a.out.js
COPY ./a.out.wasm /mnt/a.out.wasm
COPY ./state.js /mnt/state.js
RUN mkdir /gear-bus
RUN mkdir /gear-bus/bus
COPY ./mockbus/ /gear-bus/bus
#EXPOSE 3010 (stateDB)
RUN echo start
# be aware that user is root
RUN npm install 
RUN echo done
CMD ["/usr/local/bin/npm","run","start"]
