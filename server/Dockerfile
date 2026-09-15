FROM node
WORKDIR /server
COPY . .
RUN npm install
CMD ["sh", "-c", "npm run db:init && npm run dev"]