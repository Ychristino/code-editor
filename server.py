import http.server

HandlerClass = http.server.SimpleHTTPRequestHandler

# Adicione as extensões corretas
HandlerClass.extensions_map['.js'] = 'application/javascript'
HandlerClass.extensions_map['.mjs'] = 'application/javascript'

# Execute o servidor (como `python -m http.server` faz)
http.server.test(HandlerClass, port=8000)