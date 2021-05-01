#!/bin/bash

for entry in "packages"
do
  npm publish "packages/$entry"
done