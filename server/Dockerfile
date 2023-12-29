FROM node:18 as build
WORKDIR /server
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm uninstall bcrypt
RUN npm install bcrypt
COPY . .
RUN npx prisma generate

EXPOSE 5000
CMD ["npm", "run", "dev"]
