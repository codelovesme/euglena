#!/bin/bash

for entry in packages/*
do
  echo "//codeloves.me:2800/api/v4/projects/$1/packages/npm/:_authToken=$2">$entry/.npmrc
  cd $PWD/$entry
  npm publish
done