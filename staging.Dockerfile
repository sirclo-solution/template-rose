FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

ENV ASSET_PREFIX=https://staging-template.sirclocdn.com/rose
ENV CLIENT_CREDENTIAL=nexus:8252917FE4834E87191E255F6C4B9
ENV CREDENTIAL_API_URI=https://accounts.sirclo.id.dmmy.me

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Building app
RUN npm run build:staging

RUN npm ci --only=production

EXPOSE 3000

# Running the app
CMD ["npm", "start"]