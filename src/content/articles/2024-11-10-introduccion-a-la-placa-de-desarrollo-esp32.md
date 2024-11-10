---
title: Introducción a la placa de desarrollo ESP32
description: Sobre la placa de desarrollo ESP32 y cómo programar en ella con el IDE de Arduino.
date: 2024-11-10
tags:
  - esp32
  - iot
---

Hace tiempo que tengo un **ESP32** en casa, pero lo compré más por la curiosidad que por tener algo en mente con el que usarlo. Igualmente, siempre es divertido aprender cosas de IoT y electrónica, como programadores es una forma de pasar de la abstracción del código a algo tangible y aun más incromprensible como lo es el _mundo real_. AHHH, el mundo real.

Como es de esperar, no tengo ni idea de estas cosas, pero os quiero transmitir un poco de lo que he aprendido por si os es útil.

## El SoC ESP32

### ¿Qué es el la placa de desarrollo ESP32?

El **ESP32** es una serie de _microcontroladores SoC_ (system-on-chip) de bajo coste y bajo consumo energético con WIFI y Bluetooth modo dual integrados. Actualmente son creados y desarrollados por la empresa china **Expressif Systems**.

> Un **SoC** es un circuito integrado que integra (valga a redundancia), la mayor parte de los componentes de un ordenador (CPU, memoria, GPU...). Además, pueden enviar y recibir señales **digitales** y **analógicas**, incluso señales de radio. La famosa serie de chips **Apple Silicon** son SoC basados (en su mayoría) en la arquitectura **ARM**.

Esta seria es la sucesora del **ESP8266**. Es mejor en todo y viene con Bluetooth integrado. El ESP32 cuesta un poco más, pero sigue siendo barato.

Este chip se ha vuelto famoso por su bajo costo (he encontrado estos chips hasta por un 1€ en AliexPress), gran potencia (superando al **Arduino UNO**), ser (en su mayoría) Dual-core y tener WIFI y Bluetooth integrados. Además, es compatible con **Arduino IDE**.

### Especificaciones del ESP32

Por si quereis detelles muy técnicos, os dejoe el _datasheet_ oficial: https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf. Aquí simplemente voy a nombrar las cosas que entiendo:

- ADCs (Conversores analógio-digital)
- DACs (Conversores digital-analógio)
- Bluetooth (clásico) y BLE (Bluetooth Low Energy)
- Memoria:
  - ROM: 449 KB (para el arranque y las funciones básicas)
  - SRAM: 520 KB (para datos e instrucciones)

### La serie ESP32

El ESP32 es solo chip, pero también hace referencia a toda la serie (o familia) de **placas de desarrollo** que implementan el chip ESP32. Programar directamente en el chip ESP32 es poco práctico para aprender, testear o prototipar. Por eso se utilizan las placas de desarrollo, que vienen con toda la circutería necesaria para usar el chip, como pines para conectar periféricos, un puerto para conectarlo al ordenador, una antena WIFI y etc etc. Además, otras placas pueden venir con cámaras y otro tipos de sensores integrados.

Debido a que hay muchas placas, es normal abrumarse un poco. La recomendable para principiantes es **DOIT Esp32 DevKit v1** (ESP-WROOM-32). Aunque, seguramente os valga cualquiera que se parezca a esto:

!(Fotografía de una placa de desarrollo ESP32)[/images/articles/2024-11-10-introduccion-a-la-placa-de-desarrollo-esp32/fotografia-de-una-placa-de-desarrollo-esp32.png]

## ¿Cómo programar en el ESP32?

Como ya mencioné antes, el ESP32 se puede programar con el Arduino IDE usando **C++** o **Micropython**. También se puede usar **VSCode**, pero me parece que lo más fácil es usar Arduino IDE tengas o no experiencia con Arduino.

> Yo uso una distribución Linux, **Pop!\_OS** (no por nada, simplemente porque quería probar algo diferente a Ubuntu). Los pasos deberían ser los mismos para otras distribuciones basadas en Debian, pero si usas otro sistema operativo, te recomiendo ojear otros tutoriales, aunque aquí comento un error que solucioné y creo es común.

### Instalar Arduino IDE

Arduino IDE necesita JAVA y `pyserial`, así que lo primero es descargar ambos:

```bash
sudo apt install default-jre -y
```

```bash
# si no se tiene pip instalado
sudo apt install python3-pip -y

python3 -m pip install pyserial
```

Ahora añade `export PATH="/home/imangelo/.local/bin:$PATH"` al archivo `~/.bashrc` y ejecuta `source ~/.bashrc` para aplicar los cambios.

Comprueba que todo haya funcionado correctamente:

```bash
java --version

pip list | grep pyserial
```

Desde aquí puedes instalar Arduino IDE en formato ZIP o AppImage: https://www.arduino.cc/en/software.

Yo prefiero AppImage. Descargando un icono del IDE y usando un paquete de npm que creé, configuro rápidamente un desktop shortcut:

```bash
sudo mkdir /opt/arduino-ide

sudo mv ~/Downloads/arduino-ide_x.x.x_Linux_64bit.AppImage /opt/arduino-ide
sudo mv ~/Downloads/arduino-ide-icon.png /opt/arduino-ide

npx create-desktop-shortcut arduino-ide_x.x.x_Linux_64bit.AppImage -n "Arduino IDE" -i /opt/arduino-ide/arduino-ide-icon.png -c Development
```

### Instalando el ESP32 en Arduino IDE

Ahora sigue estos pasos para instalar el ESP32 en Arduino IDE:

1. Ve te a **Files > Preferences** o ejecuta el comando `Ctrl + Comma`.
2. Copia y pega el siguiente URL en **Additional Boards Manager URLs**:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
   ![Menú Preferences de Arduino IDE](/images/articles/2024-11-10-introduccion-a-la-placa-de-desarrollo-esp32/menu-preferences-de-arduino-ide.png)
3. Ahora haz click en el icono **Boards Manager** en el panel de navegación izquierdo, busca **esp32** e instala **esp32 by Expressif Systems**:
   ![Menú Boards Manager de Arduino IDE](/images/articles/2024-11-10-introduccion-a-la-placa-de-desarrollo-esp32/menu-boards-manager-de-arduino-ide.png)
4. Después de instalarlo, reinicia Arduno IDE.

Ahora, ve a **Tools > Boards** y comprueba que tengas disponible **esp32**.

### Comprobar la instalación

Para comprobar que todo ha ido bien, hay que subir un programa al ESP32. Para eso, lo primero es conectarlo por un cable USB (asegúrate de que este pueda transmitir datos). Ahora sigue estos pasos:

1. Selecciona tu placa en el menu desplegable, al lado del check y la flecha, y haz click en **Select other board and port...**
2. En **BOARDS**, busca el modelo de tu placa ESP32, en mi caso es **ESP32 DEV MODULE**. También hay que seleccionar el puerto:
   ![Seleccionar el modelo de la placa y el puerto](/images/articles/2024-11-10-introduccion-a-la-placa-de-desarrollo-esp32/seleccionar-el-modelo-de-la-placa-el-puerto.png)

Dale a **OK** y pega el siguiente código en el editor:

```cpp
// PIN del LED integrado
int LED 2;

// es llamado una vez al principio
void setup() {
	// establece el modo del PIN
	pinMode(LED, OUTPUT);
}

// es llamado en bucle
void loop() {
	// enciende el LED
	digitalWrite(LED, HIGH);
	// espera 1000 milisegundos
	delay(1000);
	// apaga el LED
	digitalWrite(LED, LOW);
	// espera otros 1000 milisegundos
	delay(1000);
}
```

Dale al botón **Upload** para compilar programa y enviarlo al ESP32:
![Botón Upload de Arduino IDE](/images/articles/2024-11-10-introduccion-a-la-placa-de-desarrollo-esp32/boton-upload-de-arduino-ide.png)

> Si al intentar subir el programa te salta el error:
>
> ```
> A fatal error ocurred: Could not open /dev/ttyUSB0, the port doesn't exist
> ```
>
> es porque no tienes permisos de lectura/escritura del puerto `/dev/ttyUSB0`.
> Una forma de arreglarlo, aunque suene sorprendente, es darte los permisos necesarios:
>
> ```bash
> sudo chmod 666 /dev/ttyXXXX
> ```
>
> Pero esp no es realmente una solución, pues lo tienes que hacer cada vez que vuelvas a encender el ordenador. La verdadera solución es añadir tu usuario al grupo `dialout`:
>
> ```bash
> # Comprueba si el grupo `dialout` tiene acceso al puerto
> ls -l /dev/tty/USB0
>
> # Añade tu usuario al grupo `dialout`
> sudo usermod -aG dialout $USER
> ```

Ahora deberías ver cómo el LED integrado de tu placa se enciende y se apaga en intervalos de 1 segundo.

¡Y ya estaría! Ahora ya puedes empezar a desarrollar proyectos de IoT. En mi caso, voy a intentar crear un coche a control remoto por Bluetooth.

## Fuentes

- https://en.wikipedia.org/wiki/Apple_silicon
- https://en.wikipedia.org/wiki/ESP32
- https://randomnerdtutorials.com/getting-started-with-esp32/
