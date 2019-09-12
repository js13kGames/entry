#! /bin/bash

# create dir
mkdir build
mkdir build/assets

# Build js
# yarn run rollup -c rollup.config.js

# Build HTML (Minifiy)
yarn run html-minifier --collapse-whitespace --remove-comments --remove-attribute-quotes --remove-optional-tags --remove-tag-whitespace src/index.html -o build/index.html

# Copy assets
cp src/assets/* build/assets/

# Zip & Measure