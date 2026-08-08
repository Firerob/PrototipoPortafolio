# -*- coding: utf-8 -*-
"""
Compilador del portafolio.

    python src/build.py

Toma src/pagina.html (el fuente que se edita) e incrusta dentro las
fuentes tipograficas y GSAP desde src/vendor/. Produce dos salidas
porque cada destino necesita una envoltura distinta:

    index.html                  -> documento completo, con <meta charset>.
                                   Es lo que se abre en el navegador o se
                                   sirve por localhost.

    dist/portafolio-artifact.html -> solo el contenido, sin doctype ni
                                   <head>: al publicar como Artifact la
                                   plataforma aporta esa envoltura.

Olvidar el <meta charset> en la salida local fue justo lo que rompio
las tildes ("pAoblico" en vez de "publico"), por eso hay una
comprobacion al final que aborta si vuelve a faltar.

Editar siempre src/pagina.html. index.html es generado: cualquier
cambio hecho a mano ahi se pierde en la siguiente compilacion.
"""
import io, os, re, sys

SRC = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(SRC)
VENDOR = os.path.join(SRC, 'vendor')
DIST = os.path.join(RAIZ, 'dist')


def leer(ruta):
    return io.open(ruta, encoding='utf-8').read()


def escribir(ruta, texto):
    carpeta = os.path.dirname(ruta)
    if carpeta and not os.path.isdir(carpeta):
        os.makedirs(carpeta)
    io.open(ruta, 'w', encoding='utf-8').write(texto)


fuente = leer(os.path.join(SRC, 'pagina.html'))

reemplazos = {
    '/*FONTS*/': os.path.join(VENDOR, 'poppins-inline.css'),
    '/*GSAP*/':  os.path.join(VENDOR, 'gsap.min.js'),
    '/*ST*/':    os.path.join(VENDOR, 'st.min.js'),
}
for marca, ruta in reemplazos.items():
    if marca not in fuente:
        print('ERROR: falta la marca ' + marca + ' en src/pagina.html')
        sys.exit(1)
    fuente = fuente.replace(marca, leer(ruta))

# ── Salida 1: Artifact (solo contenido) ──────────────────────────
escribir(os.path.join(DIST, 'portafolio-artifact.html'), fuente)

# ── Salida 2: local (documento completo) ─────────────────────────
titulo = re.search(r'<title>(.*?)</title>', fuente).group(1)
cuerpo = re.sub(r'<title>.*?</title>\s*', '', fuente, count=1)

local = (
    '<!DOCTYPE html>\n'
    '<html lang="es">\n'
    '<head>\n'
    '<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    '<title>' + titulo + '</title>\n'
    '<meta name="description" content="Estudio de arquitectura e interiorismo. '
    'Obra residencial, cultural y de rehabilitacion en Chile.">\n'
    '</head>\n'
    '<body>\n' + cuerpo + '\n</body>\n</html>\n'
)
escribir(os.path.join(RAIZ, 'index.html'), local)

# ── Comprobaciones ───────────────────────────────────────────────
fallos = []

for marca in list(reemplazos) + ['cdn.tailwindcss', 'fonts.googleapis',
                                 'cdn.jsdelivr', 'fonts.gstatic']:
    if marca in fuente:
        fallos.append('quedo una referencia a ' + marca)

if '<meta charset="utf-8">' not in local:
    fallos.append('la salida local no lleva meta charset')

# Las tildes deben sobrevivir el viaje como UTF-8 real
for esperado in (u'p\xfablico', u'construcci\xf3n', u'a\xf1os'):
    if esperado not in local:
        fallos.append('falta el texto acentuado: ' + esperado)

print('artifact: %d bytes  -> dist/portafolio-artifact.html' % len(fuente.encode('utf-8')))
print('local:    %d bytes  -> index.html' % len(local.encode('utf-8')))

if fallos:
    print('FALLOS:')
    for f in fallos:
        print('  - ' + f)
    sys.exit(1)

print('comprobaciones: OK')
