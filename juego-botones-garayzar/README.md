# JuegoContador

Juego web desarrollado en React para competir contra tu propio récord haciendo la mayor cantidad posible de clicks en 5 segundos.

## Tecnologías

- React
- Vite
- TypeScript en la configuración general del proyecto
- Componente principal implementado en `src/JuegoContadorGPT.jsx`

## Cómo correrlo en local

### Requisitos

- Node.js 18 o superior
- npm

### Instalar dependencias

```bash
npm install
```

### Iniciar entorno de desarrollo

```bash
npm run dev
```

Después abrir en el navegador la URL que informa Vite, normalmente `http://localhost:5173`.

### Generar build de producción

```bash
npm run build
```

### Previsualizar el build

```bash
npm run preview
```

## Mecánica del juego

1. El usuario presiona el botón `Iniciar partida`.
2. Se muestra una cuenta regresiva visual con los mensajes `Preparados`, `Listos` y `Ya`, en intervalos de 1 segundo.
3. Al finalizar la cuenta regresiva, se habilita el botón de click durante 5 segundos.
4. Durante la partida se actualizan en vivo el contador actual y el tiempo restante.
5. Al concluir el tiempo, el botón de click se deshabilita, el botón de inicio se vuelve a habilitar y el puntaje máximo se actualiza si corresponde.

## Decisiones de implementación

- Se usaron componentes funcionales y hooks de React para mantener la lógica clara y mantenible.
- Se priorizó el apartado visual con una interfaz tipo dashboard, fondos con gradientes, paneles translúcidos y efectos de feedback al click.
- El puntaje máximo vive en memoria del componente mientras la página permanezca abierta.

## Supuestos

- El puntaje máximo no se persiste entre recargas porque la consigna no exige almacenamiento local ni backend.
- El tiempo visible se muestra en segundos enteros, suficiente para el comportamiento esperado del juego.
- Los clicks solo suman durante la ventana activa de 5 segundos, aunque el usuario siga interactuando después.

## Archivos principales

- `src/JuegoContadorGPT.jsx`: implementación del juego.
- `src/App.tsx`: punto de entrada que renderiza el componente principal.
- `src/index.css`: estilos globales base.