FROM node:18

WORKDIR /app

# copy package files first (for caching)
COPY package*.json ./

RUN npm install

# copy full project
COPY . .

# build frontend (for production)
RUN npm run build

# install simple server to serve build
RUN npm install -g serve

# expose port
EXPOSE 3000

# run app
CMD ["serve", "-s", "build", "-l", "3000"]