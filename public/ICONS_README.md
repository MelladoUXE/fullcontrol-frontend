# PWA Icons

Para generar los iconos PNG desde el SVG, puedes usar:

## Opción 1: Online (más fácil)
1. Ir a https://realfavicongenerator.net/
2. Subir el archivo `icon.svg`
3. Descargar todos los tamaños generados

## Opción 2: Con ImageMagick (local)
```bash
# Instalar ImageMagick
# Windows: https://imagemagick.org/script/download.php#windows
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick

# Generar todos los tamaños
convert icon.svg -resize 72x72 icon-72x72.png
convert icon.svg -resize 96x96 icon-96x96.png
convert icon.svg -resize 128x128 icon-128x128.png
convert icon.svg -resize 144x144 icon-144x144.png
convert icon.svg -resize 152x152 icon-152x152.png
convert icon.svg -resize 192x192 icon-192x192.png
convert icon.svg -resize 384x384 icon-384x384.png
convert icon.svg -resize 512x512 icon-512x512.png
```

## Opción 3: Con Sharp (Node.js)
```bash
npm install -g sharp-cli
sharp -i icon.svg -o icon-72x72.png resize 72 72
sharp -i icon.svg -o icon-96x96.png resize 96 96
sharp -i icon.svg -o icon-128x128.png resize 128 128
sharp -i icon.svg -o icon-144x144.png resize 144 144
sharp -i icon.svg -o icon-152x152.png resize 152 152
sharp -i icon.svg -o icon-192x192.png resize 192 192
sharp -i icon.svg -o icon-384x384.png resize 384 384
sharp -i icon.svg -o icon-512x512.png resize 512 512
```

## Tamaños requeridos:
- 72x72 - Android Chrome
- 96x96 - Android Chrome
- 128x128 - Android Chrome
- 144x144 - Windows
- 152x152 - iOS Safari
- 192x192 - Android Chrome
- 384x384 - Android Chrome
- 512x512 - Android Chrome
