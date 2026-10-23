#!/usr/bin/env python3
"""Local-only static export preview with clean URL -> .html resolution."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        target = super().translate_path(path)
        # Next also emits RSC payload directories (e.g. reference/).
        # Prefer reference.html over that directory for a clean page URL.
        if not Path(urlsplit(path).path).suffix:
            candidate = target + '.html'
            if Path(candidate).is_file():
                return candidate
        return target

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=3000)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent / 'out'
    if not (root / 'index.html').is_file():
        parser.error('Run npm run build first (out/index.html is missing).')
    with ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(root))) as server:
        print(f'Serving static export http://127.0.0.1:{server.server_port}/', flush=True)
        server.serve_forever()
