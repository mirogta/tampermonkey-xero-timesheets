docker stop xero-userscript-server
docker rm xero-userscript-server
docker run --name xero-userscript-server -v "${PWD}:/usr/share/nginx/html".ToLower() -v "$PWD/dev/nginx.conf:/etc/nginx/nginx.conf:ro".ToLower() -p 8100:80 -d nginx
