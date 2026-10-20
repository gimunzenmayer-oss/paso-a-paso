"""Junta todos los archivos de la app en UNA sola página (vista previa).
Uso: python3 vista_previa.py <carpeta_app> <archivo_salida>
Sirve para publicarla como enlace que se abre en el móvil."""
import re, sys, pathlib
app = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2])
html = (app / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + (app / 'styles.css').read_text() + '\n</style>')
html = re.sub(r'<script src="(js/[^"]+)"></script>', lambda m: '<script>\n' + (app / m.group(1)).read_text() + '\n</script>', html)
# Las fotos de img/ se incrustan dentro de la página
import base64
for foto in sorted((app / 'img').glob('*.jpg')):
    datos = 'data:image/jpeg;base64,' + base64.b64encode(foto.read_bytes()).decode()
    html = html.replace("'img/" + foto.name + "'", "'" + datos + "'")
# La página de vista previa no lleva manifest ni icono (no se instala desde ahí)
html = re.sub(r'<link rel="(manifest|icon|preconnect)"[^>]*>\n?', '', html)
head = re.search(r'<head>(.*)</head>', html, re.S).group(1)
body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
head = re.sub(r'<meta (charset|name="viewport")[^>]*>\n?', '', head)
out.write_text(head.strip() + '\n' + body.strip() + '\n')
print('ok', out, out.stat().st_size)
