#! /bin/bash

# create dir
mkdir build

# Build js
yarn run rollup -c rollup.config.js

# Build HTML (Minifiy)
yarn run html-minifier --collapse-whitespace --remove-comments --remove-attribute-quotes --remove-optional-tags --remove-tag-whitespace src/index.html -o build/index.html

# Zip & Measure