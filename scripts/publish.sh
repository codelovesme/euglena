#!/bin/bash

for entry in packages/*
do
  cd $entry
  echo "//codeloves.me:2800/api/v4/projects/$1/packages/npm/:_authToken=$2">.npmrc
  cat ${#2}
  npm publish
  cd ../..
done