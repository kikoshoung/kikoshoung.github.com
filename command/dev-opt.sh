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

# execute optimization
run_cmd "grunt dev"
cputs "------ less & concat completed ------"
