#!/bin/bash
set –e

function compile {
  yarn compile
  result=$?
  [[ $result != 0 ]] && exit $result
}

cd packages/core
echo "compile core"
compile

cd ../template
echo "compile template"
compile
cd ..

problems=()
for entry in *; do
  cd $entry
  echo "compile $entry"
  compile
  # problems+=( $entry )
  echo "---------------"
  cd ..
done

# #print result
# [[ ${#problems[@]} != 0 ]] && echo "There are problems with those packages:" || echo "All is well !"
# for item in ${problems[@]}; do
#   echo "-$item"
# done

#return length of problems
# exit ${#problems[@]}