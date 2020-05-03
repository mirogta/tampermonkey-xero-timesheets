#!/bin/bash
docker stop xero-userscript-server  
docker rm xero-userscript-server
docker run --name xero-userscript-server -v "$PWD":/usr/share/nginx/html -v "$PWD"/dev/nginx.conf:/etc/nginx/nginx.conf:ro -p 8100:80 -d nginx  
