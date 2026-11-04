const http = require('http');
const fs = require('fs');
const path = require('path');

const publicRoot = path.resolve(__dirname, '..');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png'
};

http.createServer((request, response) => {
  let requestPath = decodeURIComponent(request.url.split('?')[0]);
  if (requestPath === '/') requestPath = '/site-preview/';

  let filePath = path.join(publicRoot, requestPath);
  if (requestPath.endsWith('/')) filePath = path.join(filePath, 'index.html');

  if (!filePath.startsWith(publicRoot)) {
    response.writeHead(403);
    return response.end('Accesso negato');
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      return response.end('File non trovato');
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
    });
    response.end(data);
  });
}).listen(4173, () => {
  console.log('Anteprima GasCloud: http://localhost:4173/site-preview/');
});
