#!/bin/bash
set –e

cd packages/core
echo "compile core"
yarn compile

cd ../template
echo "compile template"
yarn compile
cd ..

problems=()
for entry in *; do
  cd $entry
  echo "compile $entry"
  yarn compile
  result=$?
  [[ $result != 0 ]] && problems+=( $entry )
  echo "---------------"
  cd ..
done

#print result
[[ ${#problems[@]} != 0 ]] && echo "There are problems with those packages:" || echo "All is well !"
for item in ${problems[@]}; do
  echo "-$item"
done

#return length of problems
exit ${#problems[@]}