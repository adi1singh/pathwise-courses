// Minimal static server for previewing docs/ locally (no dependencies).
// Run: npm run serve  →  http://localhost:4173
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

export function startServer(port = 4173, root = docsRoot) {
  const server = createServer(async (req, res) => {
    try {
      let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
      if (path.endsWith('/')) path += 'index.html';
      let file = join(root, path);
      if (!file.startsWith(root)) throw new Error('outside root');
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      let body = await readFile(file);
      const headers = { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' };
      // Compress text like production hosts do, so local speed checks are fair.
      if (/\.(html|css|js|svg|xml|txt)$/.test(file) && /gzip/.test(req.headers['accept-encoding'] || '')) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      res.writeHead(200, headers);
      res.end(body);
    } catch {
      const body = await readFile(join(root, '404.html')).catch(() => 'Not found');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(body);
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 4173;
  await startServer(port);
  console.log(`Previewing docs/ at http://localhost:${port}`);
}
