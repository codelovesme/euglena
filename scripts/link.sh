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
cd ./packages/core
yarn link
cd ../template
yarn link
cd ../organelle.nucleus.js
yarn link
cd ..

# # tie links
for entry in *
do
  cd $entry
  echo "link dependencies of $entry"
  [[ $linkCessnalib && $(grep 'cessnalib' package.json) ]] && yarn link cessnalib
  [[ $(grep '@euglena/core' package.json) ]] && yarn link @euglena/core
  [[ $(grep '@euglena/template' package.json) ]] && yarn link @euglena/template
  cd ..
done