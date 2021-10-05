#!/bin/bash
# This is an automated script to help with creating the .env file

# these lines setup the mongo connection uri
mongoPassword=`< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-32};echo;`
mongoStartLine="MONGODB_URI=mongodb://root:"
mongoEndLine="@localhost:27017/?authSource=admin"

# this creates a next-auth secret which secures the authentication of the app
nextAuthSecret=`< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-32};echo;`

# allows user input for allow listed emails
read -p "Enter a comma seperated list of emails to allow signup access (example@email.com,another@email.com): " allowList

# ask for which port should be set for the next-auth to callback to for dev environment
read -p "What port would you like to host this app on? (recommend 3005): " port

# print out the written values
printf "\nWriting to .env with below values\n\n"
echo $mongoStartLine$mongoPassword$mongoEndLine
echo "MONGO_PASS="$mongoPassword
echo "NEXTAUTH_SECRET="$nextAuthSecret
echo "ALLOWLISTED_EMAILS="$allowList
echo "NEXTAUTH_URL=http://localhost:"$port

echo $mongoStartLine$mongoPassword$mongoEndLine > .env
echo "MONGO_PASS="$mongoPassword >> .env
echo "NEXTAUTH_SECRET="$nextAuthSecret >> .env
echo "ALLOWLISTED_EMAILS="$allowList >> .env
echo "NEXTAUTH_URL=http://localhost:"$port >> .env