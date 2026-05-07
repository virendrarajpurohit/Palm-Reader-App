import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.json', 'application/json; charset=utf-8'],
]);

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    if (!path || path === '.') path = 'index.html';
    let filePath = join(root, path);
    if (!filePath.startsWith(root)) throw new Error('Invalid path');
    const info = await stat(filePath).catch(() => null);
    if (!info?.isFile()) filePath = join(root, 'index.html');
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': types.get(extname(filePath)) || 'application/octet-stream' });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(error instanceof Error ? error.message : 'Server error');
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`PalmVeda AI running at http://localhost:${port}`);
});
