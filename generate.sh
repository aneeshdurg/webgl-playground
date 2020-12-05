#!/bin/bash

outdir=dist

rm -rf $outdir/*
mkdir -p $outdir
cp -r static/* $outdir/
for d in $(ls experiments/)
do
    src=experiments/$d
    dest=$outdir/$d
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

function generate_descriptions() {
    echo "<ul>"
    for d in $(ls experiments/)
    do
        if [ -e experiments/$d/hide-from-index ]
        then
            continue
        fi

        echo "<li>"
        echo "<a href=\"./$d\">"$d"</a>"
        cat experiments/$d/description.html 2>/dev/null || true
        echo "</li>"
    done;
    echo "</ul>"
}

cp index.html $outdir/
generate_descriptions >> $outdir/index.html

function generate_wallpaper_index() {
    echo "<ul>"
    ls $outdir/wallpaper/ | while read line
    do
        if [ "$line" == "index.html" ]
        then
            continue
        fi
        echo "<a href=\"./$line\"><img src=\"./$line\"/></a>"
        echo "<br><br>"
    done
    echo "</ul>"
}
generate_wallpaper_index > $outdir/wallpaper/index.html
