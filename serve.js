#!/usr/bin/env node
/**
 * Minimal HTTP server for local testing.
 * Usage: node serve.js [port]
 * Runs as a background daemon (detaches from terminal).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2] || '8090', 10);
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';

  const filePath = path.join(ROOT, url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found: ' + url);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`EduAI server running at http://localhost:${PORT}`);

  // Write PID file for easy cleanup
  fs.writeFileSync(path.join(ROOT, '.server.pid'), String(process.pid));

  // Detach from terminal (become daemon)
  if (process.env.NODE_ENV !== 'foreground') {
    // Keep running but don't block
  }
});
