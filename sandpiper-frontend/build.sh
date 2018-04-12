#! /usr/bin/env bash

react-scripts build
# Check if there is already a build folder
# in the outer project. If so, remove it
if [ -d ../public/build ]; then
  rm -r ../public/build
else
  mkdir ../public
fi
mv build ../public/build