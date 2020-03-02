FROM node:12 as training-auth
WORKDIR /app
COPY . ./
RUN npm i
RUN chmod +x ./start.sh
CMD ./start.sh