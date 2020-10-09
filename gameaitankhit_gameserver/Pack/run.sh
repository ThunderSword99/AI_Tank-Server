#!/bin/bash
gnome-terminal -e "node ./Server/Server.js -h 127.0.0.1 -p 3011 -k 30 11 -r Replay/Last.glr"
gnome-terminal -e "node ./Bots/Javascript/Client.js -h 127.0.0.1 -p 3011 -k 30"
gnome-terminal -e "node ./Bots/Javascript/Client.js -h 127.0.0.1 -p 3011 -k 11"

