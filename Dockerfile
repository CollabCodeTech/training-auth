FROM node:12 as training-auth
WORKDIR /app
COPY . ./
RUN npm i
EXPOSE 3001
RUN chmod +x ./start.sh
CMD ./start.sh