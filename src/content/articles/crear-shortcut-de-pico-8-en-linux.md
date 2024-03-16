---
title: Crear shortcut de PICO-8 en Linux
description: Creando un shortcut de PICO-8 en Linux.
date: 2023-12-07
tags:
  - Ubuntu
  - PICO-8
  - Tutorial
---

De Pico 8 ya hablé en mi artículo [**Cómo hacer un videojuego con PICO-8**](https://imangelo.dev/como-hacer-un-videojuego-con-pico-8), pero hoy vengo a escribir un muy breve, brevísimo, artículo sobre como crear un shortcut de Pico 8 en Ubuntu.

## Para empezar

Para empezar, si todavía no tiene comprado Pico 8, puede hacerlo en esta [página](https://www.lexaloffle.com/pico-8.php?#getpico8) (creada con PHP).

Una vez tenga descargado el programa, tendrá un directorio llamado `pico-8` con una imagen, unos textos y un par de ejecutables. Recomiendo leerse el `readme_linux.txt`, pero lo importante es que te asegures de poder ejecutar el ejecutable (valga la redundancia) con el siguiente comando:

```zsh
sudo chmod u+x pico8
```

Ahora, pruebe a ejecutar el programa con:

```zsh
./pico8
```

Si todo funciona, entonces pasamos a la siguiente face.

## Crear el shortcut

Para crear el shortcut, básicamente hay que hacer lo mismo que en mi artículo anterior, [**Descargar y configurar Firefox Developer Edition para Ubuntu**](https://imangelo.dev/descargar-y-configurar-firefox-developer-edition-en-linux), pero cambiando alguna cosilla.

Ejecute el siguiente comando para empezar a escribir en el archivo de configuración del shortcut:

```zsh
vi ~/.local/share/applications/pico_8.desktop
```

Ahora copie en el archivo el siguiente texto:

```
[Desktop Entry]
Name=Pico 8
GenericName=Pico 8
Exec=/opt/pico-8/pico8 %u
Terminal=false
Icon=/opt/pico-8/lexaloffle-pico8.png
Type=Application
Categories=Application;Development;Game;
Comment=Pico 8 Game Engine.
```

Ahora debería aparecerle el shortcut de Pico 8 junto a sus demás aplicaciones.
