#!/bin/bash
linkCessnalib=$1

# make link for cessnalib
if [ $linkCessnalib ]; 
then
  cd ../cessnalib
  yarn link
  cd ../euglena
fi


#make links for @euglena/core and @euglena/template
cd ./packages
# yarn link
ls -al
# cd ..
# ls -al
# cd template
# ls -al
# yarn link
# cd ..
# ls -al

# # tie links
# for entry in packages/*
# do
#   cd $entry
#   yarn link @euglena/core
#   yarn link @euglena/template
#   if [ $linkCessnalib ];
#   then
#     result=$(grep 'version' package.json)
#     [[ $result ]] && yarn link cessnalib
#   fi
#   cd ../..
# done