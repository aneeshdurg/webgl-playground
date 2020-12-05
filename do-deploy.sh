#!/bin/bash
set -ex

[ ! -e .live/ ] && git clone https://github.com/aneeshdurg/webgl-playground .live

pushd .live
git pull
git checkout gh-pages

rm -r *
cp -r ../dist/* .

git add .
git commit -m Updates --allow-empty
git push origin gh-pages
popd
