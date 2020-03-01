FROM node:12 as training-auth
WORKDIR /app
COPY . ./
RUN npm i
EXPOSE 3001
CMD ["npm", "run", "dev"]