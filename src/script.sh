#!/bin/bash
while true; do
    ping -c 1 192.168.1.1
    if [ $? -ne 0 ]; then
        node ./index.js
    fi

    sleep 45
done