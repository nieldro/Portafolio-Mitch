"""Genera el sistema de marca de Mitch como SVG limpios.

Una sola idea: una calavera de gato. Sin bigotes, sin destellos, sin
líneas de movimiento — todo eso era el ruido del logo anterior.
"""
import math
import os

AQUI = os.path.dirname(os.path.abspath(__file__))

# ── El símbolo ────────────────────────────────────────────────────────
# Silueta en un lienzo 0 0 200 200. Las orejas y los colmillos van
# dentro del mismo contorno: una sola figura, no piezas sueltas.
SILUETA = (
    "M40 14 L63 57 "
    "C74 48 126 48 137 57 "
    "L160 14 L167 76 "
    "C176 98 170 112 151 118 "
    "C141 122 137 127 135 137 "
    "C133 148 128 152 121 153 "
    "L117 180 L112 153 "
    "C108 154 104 154 100 154 "
    "C96 154 92 154 88 153 "
    "L83 180 L79 153 "
    "C72 152 67 148 65 137 "
    "C63 127 59 122 49 118 "
    "C30 112 24 98 33 76 Z"
)
# Cuencas: grandes y algo inclinadas, que es lo que hace felino un cráneo.
ORBITA_I = ("M72 67 C83 67 92 77 92 90 C92 103 83 113 72 113 "
            "C61 113 52 103 52 90 C52 77 61 67 72 67 Z")
ORBITA_D = ("M128 67 C139 67 148 77 148 90 C148 103 139 113 128 113 "
            "C117 113 108 103 108 90 C108 77 117 67 128 67 Z")
# Abertura nasal: corazón invertido.
NARIZ = ("M100 140 C92 133 86 128 86 122 C86 116 91 113 96 116 "
         "C98 117 99 119 100 121 C101 119 102 117 104 116 "
         "C109 113 114 116 114 122 C114 128 108 133 100 140 Z")

CALAVERA = f'{SILUETA} {ORBITA_I} {ORBITA_D} {NARIZ}'
CAJA_CALAVERA = (24, 14, 152, 166)   # x, y, ancho, alto

# ── El logotipo ───────────────────────────────────────────────────────
# Dibujado a mano, no tipografía: así el archivo no depende de fuentes.
# Altura de mayúscula 100, asta 15.
LETRAS = {
    "M": (96, "M0 100 L0 0 L20 0 L48 62 L76 0 L96 0 L96 100 L80 100 "
              "L80 28 L54 84 L42 84 L16 28 L16 100 Z"),
    "I": (15, "M0 0 L15 0 L15 100 L0 100 Z"),
    "T": (72, "M0 0 L72 0 L72 15 L43 15 L43 100 L29 100 L29 15 L0 15 Z"),
    "C": (76, "M76 22 C68 8 54 0 38 0 C17 0 0 22 0 50 C0 78 17 100 38 100 "
              "C54 100 68 92 76 78 L62 70 C56 80 48 85 39 85 "
              "C26 85 16 70 16 50 C16 30 26 15 39 15 C48 15 56 20 62 30 Z"),
    "H": (92, "M0 0 L16 0 L16 43 L76 43 L76 0 L92 0 L92 100 L76 100 "
              "L76 57 L16 57 L16 100 L0 100 Z"),
}
INTERLETRA = 16


def logotipo():
    """Devuelve (ancho, [(x, path), ...]) de la palabra MITCH."""
    x, piezas = 0, []
    for letra in "MITCH":
        ancho, d = LETRAS[letra]
        piezas.append((x, d))
        x += ancho + INTERLETRA
    return x - INTERLETRA, piezas


def grupo_logotipo(escala, tx, ty):
    ancho, piezas = logotipo()
    cuerpo = "\n".join(
        f'      <path transform="translate({x},0)" d="{d}"/>' for x, d in piezas)
    g = (f'    <g transform="translate({tx},{ty}) scale({escala})">\n'
         f'{cuerpo}\n    </g>')
    return ancho * escala, 100 * escala, g


def grupo_calavera(escala, tx, ty):
    """Coloca la calavera con su esquina superior izquierda en (tx, ty)."""
    bx, by, bw, bh = CAJA_CALAVERA
    g = (f'    <g transform="translate({tx},{ty}) scale({escala}) '
         f'translate({-bx},{-by})">\n'
         f'      <path fill-rule="evenodd" d="{CALAVERA}"/>\n    </g>')
    return bw * escala, bh * escala, g


def envolver(caja, cuerpo, titulo):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{caja}" '
            f'fill="currentColor" role="img" aria-label="{titulo}">\n'
            f'  <title>{titulo}</title>\n{cuerpo}\n</svg>\n')


def escribir(nombre, texto):
    ruta = os.path.join(AQUI, nombre)
    with open(ruta, "w", encoding="utf-8") as f:
        f.write(texto)
    print(f"  {nombre:26s} {len(texto):>6} bytes")


# ── 1. Símbolo suelto ────────────────────────────────────────────────
escribir("mitch-calavera.svg", envolver(
    "24 14 152 166",
    f'  <path fill-rule="evenodd" d="{CALAVERA}"/>',
    "Mitch — calavera de gato"))

# ── 2. Medallón: el aro fresado hace de ruleta ───────────────────────
CENTRO, DIENTES = 200, 36
dientes = []
for i in range(DIENTES):
    dientes.append(
        f'    <rect x="{CENTRO - 2}" y="{CENTRO - 188}" width="4" height="15" '
        f'transform="rotate({i * 360 / DIENTES:.4g} {CENTRO} {CENTRO})"/>')

anchoC, altoC, gCalavera = grupo_calavera(1.28, CENTRO - 152 * 1.28 / 2,
                                          CENTRO - 166 * 1.28 / 2)
escribir("mitch-medallon.svg", envolver(
    "0 0 400 400",
    '  <g fill="none" stroke="currentColor">\n'
    f'    <circle cx="200" cy="200" r="192" stroke-width="4"/>\n'
    f'    <circle cx="200" cy="200" r="164" stroke-width="2.5"/>\n'
    f'    <circle cx="200" cy="200" r="156" stroke-width="1"/>\n'
    '  </g>\n'
    '  <g>\n' + "\n".join(dientes) + '\n  </g>\n' + gCalavera,
    "Mitch — medallón"))

# ── 3. Horizontal ────────────────────────────────────────────────────
aC, hC, gC = grupo_calavera(0.80, 16, 24)
aL, hL, gL = grupo_logotipo(0.86, 16 + aC + 44, 24 + hC / 2 - 43)
escribir("mitch-horizontal.svg", envolver(
    f"0 0 {round(16 + aC + 44 + aL + 16)} {round(24 + hC + 24)}",
    gC + "\n" + gL,
    "Mitch"))

# ── 4. Apilado ───────────────────────────────────────────────────────
ANCHO_AP = 420
aC, hC, gC = grupo_calavera(0.85, (ANCHO_AP - 152 * 0.85) / 2, 16)
aL, hL, gL = grupo_logotipo(0.80, (ANCHO_AP - 415 * 0.80) / 2, 16 + hC + 40)
escribir("mitch-apilado.svg", envolver(
    f"0 0 {ANCHO_AP} {round(16 + hC + 40 + hL + 16)}",
    gC + "\n" + gL,
    "Mitch"))

# ── 5. Monograma: la M con cola, lo único que valía la pena salvar ───
anchoM, dM = LETRAS["M"]
escribir("mitch-monograma.svg", envolver(
    "-14 -62 124 176",
    f'  <path d="{dM}"/>\n'
    '  <path fill="none" stroke="currentColor" stroke-width="16" '
    'stroke-linecap="round" '
    'd="M8 4 C4 -20 14 -44 36 -44 C54 -44 62 -28 52 -18 '
    'C45 -11 33 -15 35 -26"/>',
    "Mitch — monograma"))

print("\nListo.")
