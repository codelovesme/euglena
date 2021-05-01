#!/bin/bash

for entry in "packages"
do
  echo "//codeloves.me:2800/api/v4/projects/$1/packages/npm/:_authToken=$2">packages/$entry/.npmrc
  npm publish "packages/$entry"
done