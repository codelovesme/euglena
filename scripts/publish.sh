#!/bin/bash

for entry in packages/*
do
  cd $entry
  echo "//registry.npmjs.org/:_authToken=$1" > .npmrc
  npm publish --access public
  cd ../..
done