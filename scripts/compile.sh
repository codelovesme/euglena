#!/bin/bash
set –e

compile() {
  yarn --cwd $1 compile
  result=$?
  [[ $result != 0 ]] && exit $result
}

cd packages

echo "compile core"
compile core

echo "compile template"
compile template

problems=()
for entry in *; do
  echo "compile $entry"
  compile $entry
  # problems+=( $entry )
  echo "---------------"
done

cd ..

# #print result
# [[ ${#problems[@]} != 0 ]] && echo "There are problems with those packages:" || echo "All is well !"
# for item in ${problems[@]}; do
#   echo "-$item"
# done

#return length of problems
# exit ${#problems[@]}