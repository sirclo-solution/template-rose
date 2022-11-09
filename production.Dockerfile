FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

ENV ASSET_PREFIX=https://template.sirclocdn.com/rose
ENV CLIENT_CREDENTIAL=nexus:C5979C2DE9E4F77EA9F8FC32B31B1
ENV CREDENTIAL_API_URI=https://accounts.sirclo.id

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Building app
RUN npm run build

RUN npm ci --only=production

EXPOSE 3000

# Running the app
CMD ["npm", "start"]