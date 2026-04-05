# Juego-Botones-Garayzar

Este proyecto contiene una app web hecha con React y Vite. El objetivo del juego es hacer la mayor cantidad posible de clicks en 5 segundos y superar tu propio puntaje máximo.

Toda la aplicación está dentro de la carpeta `juego-botones-garayzar`.

## Qué necesitás antes de empezar

Para poder ejecutar el proyecto en tu computadora necesitás tener instalado lo siguiente:

1. `Node.js`.
2. `npm`, que normalmente ya viene incluido cuando instalás Node.js.

Si no sabés si ya lo tenés instalado, abrí una terminal y probá estos comandos:

```bash
node -v
npm -v
```

Si ambos muestran una versión, entonces ya está listo.

## Cómo ejecutar la solución en un entorno local, paso a paso

### Paso 1: abrir una terminal

Podés usar la terminal de VS Code, PowerShell, CMD o cualquier terminal que tengas en Windows.

### Paso 2: entrar a la carpeta del proyecto React

Desde la carpeta raíz de este repositorio, ejecutá:

```bash
cd juego-botones-garayzar
```

Esto te mueve a la carpeta donde está la aplicación que realmente se ejecuta.

### Paso 3: instalar las dependencias

Ejecutá este comando una sola vez:

```bash
npm install
```

Este paso descarga todo lo que el proyecto necesita para funcionar.

En caso de solo tener los juegos, deberas correr este comando npm create vite@latest nombre-de-tu-proyecto -- --template react-ts
En mi caso reemplaze el nombre del proyecto por juego-botones-garayzar.
Esto descargara todas las dependecias y deberemos mover nuestros juegos dentro de la carpeta src.

### Paso 4: iniciar el servidor de desarrollo

Ejecutá:

```bash
npm run dev
```

Cuando termine de arrancar, la terminal te va a mostrar una dirección local. Normalmente suele ser algo parecido a:

```bash
http://localhost:5173/
```

### Paso 5: abrir el proyecto en el navegador

Copiá esa dirección y abrila en tu navegador. Ahí vas a ver el juego funcionando.

## Cómo cambiar entre JuegoContador, JuegoContadorGPT y JuegoContadorSonnet

El proyecto quedó preparado para cambiar fácilmente entre las tres versiones del juego.

### Archivo que tenés que editar

Abrí este archivo:

`juego-botones-garayzar/src/App.tsx`

### Qué línea tenés que buscar

Dentro del archivo vas a encontrar esta constante:

```ts
const ACTIVE_GAME = 'juegocontadorgpt'
```

### Qué valores podés usar

Podés reemplazar ese valor por cualquiera de estos tres:

```ts
const ACTIVE_GAME = 'juegocontador'
```

```ts
const ACTIVE_GAME = 'juegocontadorgpt'
```

```ts
const ACTIVE_GAME = 'juegocontadorsonnet'
```

### Qué hace cada uno

1. `juegocontador`: carga la versión base.
2. `juegocontadorgpt`: carga la versión desarrollada en `JuegoContadorGPT.jsx`.
3. `juegocontadorsonnet`: carga la otra versión alternativa.

### Después de cambiarlo

Guardá el archivo. Si el servidor de desarrollo ya estaba corriendo con `npm run dev`, la página se actualiza sola.

## Comandos útiles

### Volver a abrir el proyecto en desarrollo

```bash
cd juego-botones-garayzar
npm run dev
```

### Crear la versión de producción

```bash
cd juego-botones-garayzar
npm run build
```

Este comando revisa que el proyecto compile correctamente y genera la carpeta `dist`.

### Ver la versión de producción en local

```bash
cd juego-botones-garayzar
npm run preview
```

## Qué hace el juego

1. Muestra un botón para iniciar la partida.
2. Muestra un botón para sumar clicks, el cual no se puede presionar hasta que empieza el juego.
3. Muestra el contador actual de puntos.
4. Muestra el puntaje máximo que logro el usuario.
5. Al iniciar, aparece la secuencia `Preparados`, `Listos` y `Ya`.
6. Después del `Ya`, el botón de click queda habilitado por 5 segundos.
7. Cuando termina el tiempo, se compara el resultado actual con el récord máximo.
8. En caso del que el usuario vuelva a tocar el boton empezar mientras esta en medio de una partida, se reiniciara el contador actual y el temporizador.

## Archivos importantes

2. `juego-botones-garayzar/src/JuegoContador.jsx`: versión base.
3. `juego-botones-garayzar/src/JuegoContadorGPT.jsx`: versión GPT.
4. `juego-botones-garayzar/src/JuegoContadorSonnet.jsx`: versión Sonnet.
