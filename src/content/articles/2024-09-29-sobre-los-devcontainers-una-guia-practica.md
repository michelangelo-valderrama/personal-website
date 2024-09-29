---
title: 'Sobre los Dev Containers: Una guía práctica'
description: Aprende cómo los Dev Containers optimizan el desarrollo de proyectos frontend y backend, creando entornos replicables y ahorrando tiempo en configuraciones complejas.
date: 2024-09-29
tags:
  - docker
  - devcontainers
---

## Introducción

Hace un tiempo empecé a implementar Dev Containers a algunos proyectos. Aunque no soy un experto en Docker (ni en nada, realmente), me gustaría compartir un poco sobre lo que he aprendido.

Los Dev Containers son una tecnología que permiten desarrollar dentro de un contenedor. Sabiendo un poco de Docker, es posible ahorrar mucho tiempo y dolores de cabeza a la hora de tener que trasladar el entorno de trabajo a un nuevo ordenador o a un nuevo miembro del equipo.

Ya sabéis, eso de que hay que instalar x versión de node, que en Windows no funciona (siempre pasa algo en Windows), que hay que instalar x extensiones. En general, todas las variantes de **"en mi máquina funciona"**. Una pérdida de tiempo tremenda. Gracias a los contenedores, ahora podemos crear un entorno y replicarlo cuantas veces queramos sin esfuerzo.

En este artículo, iré poco a poco implementando los Dev Containers a un par de proyectos, y al final os compartiré algunos casos específicos que he tenido, los cuales tal vez os sean útiles :>

Para los proyectos, os dejo el repositorio: https://github.com/michelangelo-valderrama/devcontainers-article.

## Primer proyecto: Frontend con Vite

Fácil, tenemos una web con Vite (por hacer un proyecto rápido, pero podría ser cualquier frontend con Astro, Angular…) y queremos implementar los Dev Containers. No hay ninguna necesidad más que tener un Linux (p. ej. Debian o Ubuntu) con Node, NPM, Git y alguna extensión útil como GitLens o Pretty TypeScript Errors (claro está, en caso de usar TypeScript).

Para implementar los Dev Containers, primero hay que instalar la extensión oficial [ms-vscode-remote.remote-containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) y crear el archivo `devcontainer.json` en el directorio `.devcontainer`:

```
.devcontainer/
	devcontainer.json
public/
.gitignore
```

Este será el archivo que buscará la extensión para saber que tenemos un Dev Container y crearlo. Si quisiéramos, podríamos tener más de uno:

```
.devcontainer/
	python-backend/
		devcontainer.json
	react-frontend/
		devcontainer.json
```

Ahora hay que configurar la creación del Dev Container en el `devcontainer.json`. Si gustáis de más detalles podéis leer la referencia oficial: https://containers.dev/implementors/json_reference/.

```json title=".devcontainer/devcontainer.json"
{
  "name": "vite-example",

  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",

  "customizations": {
    "vscode": {
      "extensions": ["eamodio.gitlens", "esbenp.prettier-vscode"],
      "settings": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true,
        "editor.tabSize": 2
      }
    }
  },

  "forwardPorts": [5173],

  "postCreateCommand": "npm i && npm run dev",
  // o yarn/pnpm install, pues la imagen también viene con yarn y pnpm.

  "remoteUser": "node"
}
```

| Opción              | Descripción                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`              | El nombre del Dev Container.                                                                                                                                                                                             |
| `image`             | El nombre de una imagen de un registro de contenedores.                                                                                                                                                                  |
| `customization`     | Configuración de herramientas específicas, en este caso de VS Code.                                                                                                                                                      |
| `forwardPorts`      | Crea una lista de puertos dentro del contenedor disponibles localmente.                                                                                                                                                  |
| `postCreateCommand` | Un _string_ o lista de comandos que se ejecutan después de crearse el contenedor.                                                                                                                                        |
| `remoteUser`        | Sobrescribe el usuario que se ejecuta en el contenedor. Por defecto es el de `containerUser`, que a su vez es por defecto el usuario `root` o el de la instrucción `USER` del Dockerfile usado para crear la imagen[^1]. |

La imagen `mcr.microsoft.com/devcontainers/javascript-node:22` es oficial de Microsoft y es muy útil para proyectos de Node. Si queréis saber de más imágenes, os dejo el link a un repositorio: https://github.com/devcontainers/images/tree/main/src.

> En mis proyectos con TypeScript, uso la imagen de JavaScript. Como ya mencioné, solo hay que añadir alguna extensión más.

Una vez hecho esto, al volver a abrir el proyecto aparecerá una alerta abajo a la derecha para re-abrirlo en un contenedor. Pero también se puede mediante el comando **`Dev Containers: Reopen in Container`** desde el **Command Palette** (`F1` o `Ctrl + Shift + P`).

> Cuando cambiéis la configuración del Dev Container, debéis ejecutar el comando `Dev Container: Rebuild and Reopen in Container`. Y, en el caso de querer borrar algún Dev Container, ejecutar `Dev Container: Clean Up Dev Containers...`

Después, al abrir la terminal, veréis que tiene una terminal con ZSH y Oh My ZSH (gracias a la imagen de Microsoft), y que se encuentra en el directorio `/workspaces/NOMBRE_DEL_DIRECTORIO_DEL_PROYETO`.

Ahora se podrá ejecutar `npm run dev` y, si todo ha ido bien, ver algo así:

```
  VITE v5.4.2  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Problema con Vite y los dev containers

Si intentáis acceder a `localhost:5173`, notaréis que no carga. [Esto es un problema un tanto extraño con Vite y los dev containers](https://github.com/vitejs/vite/issues/16522), pero en principio debería arreglarse añadiendo el argumento `--host`:

```json title="package.json" {4,6}
{
  //...
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview --host"
  }
  //...
}
```

Si se ejecuta otra vez `npm run dev` y accedéis a `localhost:5173` desde el navegador, debería ver la web del proyecto.

### Partir de un Dockerfile

Si lo que se busca es una imagen más personalizada, se puede partir de la imagen de un Dockerfile:

```dockerfile title=".devcontainer/Dockerfile"
FROM mcr.microsoft.com/devcontainers/javascript-node:22

RUN apt-get update && apt-get install git-flow -y \
    && rm -rf /var/lib/apt/lists/*
```

```json title=".devcontainer/devcontainer.json" del={3} add={4-6}
{
  // ...
  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",
  "build": {
    "dockerfile": "Dockerfile"
  }
  // ...
}
```

En este Dockerfile, además, instalo Git Flow y elimino la caché para [optimizar la imagen](https://docs.docker.com/build/building/best-practices/#run)[^2].

### Git

No hace falta hacer nada en especial para configurar Git en un Dev Container, por defecto VS Code se encarga y puedes seguir trabajando con normalidad.

## Segundo proyecto: Backend con Node y Mongo

Cuando se tienen proyectos más complejos que necesitan una base de datos y un servidor, se necesitará a su vez gestionar más contenedores. Pero no hay problema porque los Dev Containers también soportan Docker Compose.

Con respecto al archivo `devcontainer.json`, solo hay algunas diferencias:

```json title=".devcontainer/devcontainer.json" {4-6}
{
  "name": "node-example",

  "dockerComposeFile": "compose.yml", // (1)
  "service": "api", // (2)
  "workspaceFolder": "/workspace", // (3)

  "customizations": {
    "vscode": {
      "extensions": ["mongodb.mongodb-vscode", "Postman.postman-for-vscode"]
    }
  },
  "forwardPorts": [3000],
  "postCreateCommand": "npm i && npm run dev",
  "remoteUser": "node"
}
```

(1) En el atributo `dockerComposeFile`, indicamos la ruta del archivo Docker Compose `compose.yml` (o `docker-compose.yml`).

(2) Establecemos el servicio al que debe conectarse el Dev Container.

(3) Cuando se parte de una imagen o un Dockerfile, no hace falta indicar el `workspaceFolder` porque el Dev Container puede asumirlo. Sin embargo, cuando se usa un archivo Docker Compose, se necesita definir explícitamente.

Y este es el archivo `compose.yml`:

```yaml title=".devcontainer/compose.yml" {5,7,8,13,15}
services:
  api:
    image: mcr.microsoft.com/devcontainers/javascript-node:22
    container_name: node-example-api
    network_mode: service:db # (1)
    volumes:
      - ..:/workspace:cached # (2)
    command: /bin/sh -c "while sleep 1000; do :; done" # (3)
  db:
    image: mongo:7
    container_name: node-example-db
    ports:
      - 27017:27017 # (4)
    volumes:
      - node-example-db-data:/data/db # (5)

volumes:
  node-example-db-data:
```

(1) `network_mode` enlaza directamente la red del contenedor del `api` con la del `db`, esto permite acceder a la base de datos mediante el localhost.

(2) Monta el directorio del proyecto (`..`, porque este `compose.yaml` está en el directorio `.devcontainer`), en el directorio `/workspace` dentro del contenedor. La flag `:cached` solo afecta a MacOS y mejora el rendimiento en lecturas pesadas, a coste de alguna inconsistencia temporal entre el host y el contenedor.

(3) Este comando evita que el contenedor se detenga al terminar algún proceso pues es un proceso infinito.

(4) Mapeo el puerto de la base de datos para poder acceder a esta desde el host. No es necesario si se usa la extensión de MongoDB (`mongodb.mongodb-vscode`, que se instala automáticamente en el contenedor), pero en lo personal prefiero [Mongo Compass](https://www.mongodb.com/products/tools/compass). A gustos colores.

(5) Determino un volumen (gestionado por Docker) para persistir la base de datos. También se podría usar un bind mount, pero en este escenario no ofrece ninguna ventaja.

> Si haciendo pruebas os quedan muchos volúmenes o imágenes basura, siempre podéis usar los comandos `docker volume prune` y `docker image prune`.

## Algunos casos específicos

Ahora, algunos casos específicos que me han ocurrido y quiero contaros.

### Acceder desde la IP

A veces queremos poder comprobar el funcionamiento de una web desde el móvil, o necesitamos que una aplicación móvil haga peticiones al API en nuestro ordenador durante el desarrollo. En este caso, es mejor borrar `network_mode: service:db` y mapear el puerto del API:

```yml del={5} add={9,10}
services:
  api:
    image: mcr.microsoft.com/devcontainers/javascript-node:22
    container_name: node-example-api
    network_mode: service:db
    volumes:
      - ..:/workspace:cached
    command: /bin/sh -c "while sleep 1000; do :; done"
    ports:
      - 3000:3000
  #...
```

### Optimizar el `node_modules`

Si el `npm i` va muy lento, a lo mejor se soluciona [optimizando el acceso al directorio `node_modules`](https://code.visualstudio.com/remote/advancedcontainers/improve-performance#_use-a-targeted-named-volume). Esto es porque en MacOs y en Windows, los contenedores se ejecutan en una Máquina Virtual[^3], lo que hace que los bind mounts no sean tan eficientes. Para solucionar esto solo hay que añadir la configuración pertinente:

**Dockerfile o imagen**

```json
"mounts": [
  "source=${localWorkspaceFolderBasename}-node_modules,target=${containerWorkspaceFolder}/node_modules,type=volume"
],
"postCreateCommand": "sudo chown node node_modules" // necesario si no eres root
```

**Docker Compose**

```yaml add={6}
services:
  api:
	  # ...
    volumes:
      - ..:/workspace:cached
      - node-example-node_modules:/workspace/node_modules
  # ...
```

### Instalar herramientas

Si, por ejemplo, necesitas el CLI de AWS, en lugar de intentar configurarlo desde cero, puedes usar una **Feature** y gozarlo:

```json {4-6,8-10}
{
  //...
  "features": {
    "ghcr.io/devcontainers/features/aws-cli:1": {
      "version": "latest"
    } // (1)
  },
  "mounts": [
    "source=${localEnv:HOME}/.aws,target=/workspace/.aws,type=bind,readonly"
  ] // (2)
  //...
}
```

```yml {3-5}
services:
  api:
    environment:
      - AWS_CONFIG_FILE=/workspace/.aws/config
      - AWS_SHARED_CREDENTIALS_FILE=/workspace/.aws/credentials # (3)
  #...
```

(1) Configuro [la feature de AWS CLI](https://github.com/devcontainers/features/tree/main/src/aws-cli). Aquí un repositorio con más features: https://github.com/devcontainers/features.

(2) Configuro un bind mount de la carpeta `~/.aws/` (con los archivos `config` y `credentials`) a la de `/workspace/.aws/` en el contenedor, para mantener mi configuración y credenciales.

(3) Configuro las variables de entorno de AWS.

## Despedida

Y esto es todo. Todavía no he usado los Dev Containers en muchos proyectos, pero quería contar algo de lo que he aprendido sobre ellos.

Hace tiempo que no escribo algo técnico, y lo echaba un poco en falta. Todavía no me veo volviendo a escribir un artículo de investigación, matemáticas o física; pero bueno, solo es cuestión de tiempo.

Personalmente, veo los Dev Containers algo muy útil, pero que chupan bastantes recursos del sistema. Creo que lo mejor sería usarlos en monorepos, pero no lo he probado todavía, así que nada.

Espero que este artículo haya sido útil, que te haya animado a probar esta nueva tecnología o que simplemente hayas aprendido algo nuevo, que nunca viene mal.

[^1]: Por temas de seguridad, [es preferente usar un usuario _non-root_ en el contenedor](https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user).
[^2]: Es posible que vea como otros también usan `apt-get clean`, pero en este caso es innecesario pues [ya lo hacen las imágenes de Debian y Ubuntu](https://github.com/moby/moby/blob/03e2923e42446dbb830c654d0eec323a0b4ef02a/contrib/mkimage/debootstrap#L82-L105).
[^3]: Esto debido a que los `cgroups` y los `namespaces` solo están disponibles en Linux. Aunque sería posible crear contenedores usando los mecanismos de aislamiento nativos de cada sistema operativo, o por lo menos [hay alguna iniciativa al respecto](https://earthly.dev/blog/macos-native-containers/).
