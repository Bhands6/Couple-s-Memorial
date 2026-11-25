#!/usr/bin/env python3
"""本地预览服务器 —— 带正确的 JS/GLB MIME 类型。

为什么需要它：
  系统自带的 `python -m http.server` 会把 .js 当 text/plain 返回，
  浏览器会拒绝加载 ES module，导致 3D 玫瑰花束静默回退成 2D 点阵。
  本脚本修正 MIME，让 3D 模型在本地也能正常显示。

用法：
  py -3 serve.py           # 默认端口 5173
  py -3 serve.py 8080      # 指定端口

然后浏览器打开 http://127.0.0.1:5173/
（注意：不要用 python，只用 py -3 —— 本机 python 指向 Python 2）
"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173


class PreviewHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        lower = path.lower()
        if lower.endswith(('.js', '.mjs')):
            return 'application/javascript'
        if lower.endswith('.glb'):
            return 'model/gltf-binary'
        if lower.endswith('.gltf'):
            return 'model/gltf+json'
        return super().guess_type(path)


if __name__ == '__main__':
    with socketserver.TCPServer(('127.0.0.1', PORT), PreviewHandler) as httpd:
        print(f'Serving at http://127.0.0.1:{PORT}/  (Ctrl+C to stop)')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nStopped.')
