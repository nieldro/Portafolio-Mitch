"""Recorta detalles de las cuatro láminas mayores.

No inventa nada: son ampliaciones de sus propias piezas, para que se vea
el oficio de cerca (filete, cenefa, lettering, tipografía).
Genera además una hoja de contactos para juzgarlos todos de un vistazo.
"""
import os
from PIL import Image

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ORIG = os.path.join(RAIZ, "assets", "_originales")
DEST = os.path.join(RAIZ, "assets", "img", "detalle")
ANCHO, ALTO = 1050, 700   # todos los detalles son horizontales, 3:2

# Cada caja ya es 3:2 (ancho = 1.5 x alto). Con proporciones libres unos
# detalles salían cuadrados y otros apaisados y la tira perdía el ritmo.
# Los de MitchMu no se usan en la página y quedan fuera.
# (archivo, [(nombre, x1, y1, x2, y2, rótulo), ...])
RECORTES = [
    ("kaomi-packaging.png", [
        ("kaomi-1", 448, 240, 1063, 650, "Logotipo sobre damasco tramado"),
        ("kaomi-2", 495,  75,  915, 355, "Filete dorado y ángulo de la tapa"),
        ("kaomi-3", 130, 420,  550, 700, "Interior forrado y lengüeta de apertura"),
    ]),
    ("tairons-vodka.png", [
        ("tairons-1", 514, 800, 1024, 1140, "Máscara: ilustración de la contracara"),
        ("tairons-2", 582, 260,  987,  530, "Sol tairona y bloque de marca"),
        ("tairons-3",   0, 300,  600,  700, "Cenefa lateral, construida por módulos"),
    ]),
    ("ferrari-icons.jpeg", [
        ("ferrari-1", 150, 205, 1075, 822, "Cabecera: slab con condensada en oro"),
        ("ferrari-2",  40, 500,  580, 860, "Ficha de modelo con rango de años"),
        ("ferrari-3",  40, 1224, 560, 1571, "Numeral de cierre, sobreimpreso"),
    ]),
]

def recortar():
    os.makedirs(DEST, exist_ok=True)
    hechos = []
    for archivo, regiones in RECORTES:
        ruta = os.path.join(ORIG, archivo)
        if not os.path.exists(ruta):
            print(f"  FALTA {archivo}")
            continue
        im = Image.open(ruta).convert("RGB")
        for nombre, x1, y1, x2, y2, rotulo in regiones:
            x2 = min(x2, im.width)
            y2 = min(y2, im.height)
            recorte = im.crop((x1, y1, x2, y2))
            trozo = recorte.resize((ANCHO, ALTO), Image.LANCZOS)
            salida = os.path.join(DEST, nombre + ".jpg")
            trozo.save(salida, "JPEG", quality=88, optimize=True, progressive=True)
            hechos.append((salida, nombre, rotulo))
            print(f"  {nombre:12s} {x2-x1:>4}x{y2-y1:<4} → {ANCHO}x{ALTO}  "
                  f"{os.path.getsize(salida)//1024:>3} KB")
    return hechos


def hoja_de_contactos(hechos):
    """Los doce recortes en tiras de alto fijo, para juzgarlos de una vez."""
    alto, margen, por_fila = 220, 10, 3
    filas = [hechos[i:i + por_fila] for i in range(0, len(hechos), por_fila)]
    tiras = []
    for fila in filas:
        imgs = []
        for ruta, _, _ in fila:
            im = Image.open(ruta)
            imgs.append(im.resize((round(im.width * alto / im.height), alto),
                                  Image.LANCZOS))
        ancho = sum(i.width for i in imgs) + margen * (len(imgs) + 1)
        tira = Image.new("RGB", (ancho, alto + margen * 2), (10, 8, 9))
        x = margen
        for im in imgs:
            tira.paste(im, (x, margen))
            x += im.width + margen
        tiras.append(tira)

    ancho = max(t.width for t in tiras)
    hoja = Image.new("RGB", (ancho, sum(t.height for t in tiras)), (10, 8, 9))
    y = 0
    for t in tiras:
        hoja.paste(t, (0, y))
        y += t.height
    destino = os.path.join(DEST, "_contactos.jpg")
    hoja.save(destino, "JPEG", quality=86)
    print(f"\n  hoja de contactos → {destino}")


if __name__ == "__main__":
    hoja_de_contactos(recortar())
