#!/bin/bash
# This is an automated script to help with creating the .env file

# these lines setup the mongo connection uri
MONGO_PASS=$(echo $RANDOM | md5sum | head -c 20; echo;)
mongoStartLine="MONGODB_URI=mongodb+srv://root:"
mongoEndLine="@localhost:27017/money?retryWrites=true&w=majority"

# this creates a next-auth secret which secures the authentication of the app
AUTH_SECRET=$(echo $RANDOM | md5sum | head -c 20; echo;)

# allows user input for allow listed emails
read -p "Enter a comma seperated list of emails to allow signup access (example@email.com,another@email.com): " allowList

# ask for which port should be set for the next-auth to callback to for dev environment
read -p "What port would you like to host this app on? (recommend 3000): " port

# print out the written values
printf "\nWriting to .env with below values\n\n"
echo $mongoStartLine$MONGO_PASS$mongoEndLine
echo "MONGO_PASS="$MONGO_PASS
echo "NEXTAUTH_SECRET="$AUTH_SECRET
echo "ALLOWLISTED_EMAILS="$allowList
echo "NEXTAUTH_URL=http://localhost:"$port

echo $mongoStartLine$MONGO_PASS$mongoEndLine > .env
echo "MONGO_PASS="$MONGO_PASS >> .env
echo "NEXTAUTH_SECRET="$AUTH_SECRET >> .env
echo "ALLOWLISTED_EMAILS="$allowList >> .env
echo "NEXTAUTH_URL=http://localhost:"$port >> .env