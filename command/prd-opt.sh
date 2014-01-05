#!/bin/bash

cputs() {
    printf "\033[01;36;40m$1\033[00m\n"
}

run_cmd() {
    printf "\033[01;32m$1\033[00m\n"
    printf "\033[01;34;40m"
    $1
    if [ $? != 0 ]
    then
        printf "\033[01;33;41mFailed: $1\033[00m\n"
        exit 1
    fi
    printf "\033[00m"
}

try_cmd() {
    printf "\033[01;32m$1\033[00m\n"
    printf "\033[01;34;40m"
    $1
    if [ $? != 0 ]
    then
        printf "\033[01;33;41mWarning: $1\033[00m\n"
    fi
    printf "\033[00m"
}

# checkout to optimize branch
try_cmd "git branch -D optimize"
cputs "------ deleted local branch [optimize] ------"
try_cmd "git push origin --delete optimize"
cputs "------ deleted remote branch [optimize] ------"
run_cmd "git checkout -b optimize"
cputs "------ created new brnach [optimize] ------"

# execute optimization
run_cmd "grunt prd"
cputs "------ optimization completed ------"

# commit optimization
run_cmd "git commit -am 'optimizd'"
run_cmd "git push origin optimize"
cputs "------ DONE ------"

# go back to oringinal branch
run_cmd "git checkout master"
cputs "------ returned to branch master ------"
