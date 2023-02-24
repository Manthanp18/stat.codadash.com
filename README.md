> Live sample viewable [here](http://stat-sample.codadash.com.s3-website-us-east-1.amazonaws.com/)
# About
This is a self-host financial tracker. Ideal for single goal tracking with multiple people involved making contributions.
The app is built using Next.js, Mongodb and uses next-auth for authentication.

![pie](https://github.com/codabool/stat.codadash.com/blob/sample/public/image/pie.jpg?raw=true)

Open Source and free. Own your own data, and secure it with login based authentication. Deploy it yourself locally or use the Vercel platform combined with MongoDB Atlas.

![table](https://github.com/codabool/stat.codadash.com/blob/sample/public/image/table.jpg?raw=true)

# Self-host
This project can be self-hosted for use. Follow the steps below

## Requirements
- node
- git
- docker

## Clone the project

> `git clone https://github.com/CodaBool/stat.codadash.com.git`

## Create an .env file and fill all fields

```
# .env
MONGODB_URI=
MONGO_PASS=
NEXTAUTH_SECRET=
ALLOWLISTED_EMAILS=
NEXTAUTH_URL=
```

## Or use the auto env script (Always read scripts before running)
> `sudo genEnvFile.sh`

The NEXTAUTH_URL environment variable is used for callbacks and all authentication api calls. If you going to be using outside of localhost this will need to be the full production url e.g. https://my.vercel.app.com

## Create the database
Please keep in mind that this guide sets up a database WITHOUT ssl (insecure transit) and app => database traffic should be local and in a secure network. If you want to instead use a cloud host for the Mongo database, I would recommend Mongo Atlas, they offer a 5GB free tier which should be more than enough. Make sure to set a strong password, and add the ip of the application to the network allow list.

## Start a MongoDB docker container
This will download the image and start a container of MongoDB on port 27017 using the password of the .env file
skip if you wish to use Mongo Atlas for your database
> `docker-compose up -d`

## Ensure it is running
> `docker ps`

## Install packages
> `npm install`

## (optional) Change Port
change the listen port @server.js line 23 replace both occurances of 3005 with your new port. Also ensure NEXTAUTH_URL in your .env file is updated if hosting locally.
```js
  }).listen(3005, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3005')
  })
```

## Start the app
> `npm run server`


# 2022 Update
+easy editing of any row data

+new Detailed view for all categories

+short history view by default for main page

+reordered the input row to the top

# 2023 Update
+can select year in the detail page

+can see percentage in the doughnut chart

+all packages updated to latest

+removed a couple dependencies in favor of naitive browser functions (axios, nookies, timeago.js, next-connect)

+added SWR which makes data fetching much nicer
