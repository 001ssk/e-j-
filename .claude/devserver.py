import http.server
import os

class CleanUrlHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = path.split('?', 1)[0].split('#', 1)[0]
        clean = super().translate_path(path)
        if path != '/' and not os.path.splitext(clean)[1] and not os.path.isdir(clean):
            candidate = clean + '.html'
            if os.path.isfile(candidate):
                return candidate
        return clean

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    http.server.test(HandlerClass=CleanUrlHandler, port=5050, bind='127.0.0.1')
