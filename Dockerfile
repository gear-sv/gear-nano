

FROM node:lts-slim
RUN apt-get update -y && apt-get install git bzip2 -y

# set wkdir to mnt
WORKDIR /mnt

COPY ./package.json /mnt/package.json
COPY ./bin /mnt/bin

# be aware that user is root
RUN npm install 

# only for semantics
EXPOSE 3010 (stateDB)
EXPOSE 3009 (txDB)

# make sure to pass this ENV at runtime
ENV contractID=NULL

CMD ["/usr/local/bin/npm","run","start"]
