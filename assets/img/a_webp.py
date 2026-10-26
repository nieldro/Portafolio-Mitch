"""Convierte los JPG de una carpeta a WebP (calidad 82, esfuerzo maximo).

Uso:  python -I assets/img/a_webp.py assets/img/thumb
No borra los JPG: quedan como originales de trabajo y no se despliegan.
"""
import sys
from pathlib import Path
from PIL import Image

carpeta = Path(sys.argv[1])
total_antes = total_despues = 0
for jpg in sorted(carpeta.glob("*.jpg")):
    destino = jpg.with_suffix(".webp")
    with Image.open(jpg) as im:
        im.convert("RGB").save(destino, "WEBP", quality=82, method=6)
    total_antes += jpg.stat().st_size
    total_despues += destino.stat().st_size
    print(f"{jpg.name:28} {jpg.stat().st_size // 1024:5} KB -> {destino.stat().st_size // 1024:4} KB")
print(f"TOTAL {total_antes // 1024} KB -> {total_despues // 1024} KB")
