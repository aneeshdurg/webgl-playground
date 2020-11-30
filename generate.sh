#!/bin/bash

rm -rf build
mkdir build
cp -r static/* build/
for d in $(ls experiments/)
do
    src=experiments/$d
    dest=build/$d
    mkdir $dest

    for f in $(ls $src)
    do
        srcfile=$src/$f
        if [ -f $srcfile ]
        then
            sed '/^<template>$/{
                s/^<template>$//g
                r template.html
            }' $srcfile > $dest/$f
        else
            cp -r $srcfile $dest/
        fi
    done
done
