# 🤖 Prompts — Comparativa de Modelos de IA

> Experimento de desarrollo: se le envió el mismo desafío técnico a dos modelos de IA (**Claude Sonnet** y **ChatGPT**) para comparar resultados. El ganador fue implementado como versión final.

---

## 🟣 Prompts enviados a Claude Sonnet

### Prompt 1

> Hola Sonnet, vas a competir contra otro modelo de IA para ver quién hace un mejor juego. Si le ganás me voy a quedar con tu versión, así que hacelo lo mejor que puedas. Te voy a entregar las consignas de lo que debés hacer. Enfocate principalmente en el apartado visual, que es lo que más atrae a los usuarios. Este juego lo vas a tener que desarrollar en React.

---

### Prompt 2

> Las consignas son las de este archivo. Decime si lo podés leer y el juego desarrollalo en `JuegoContadorSonnet`.

---

### Prompt 3 — Consignas del ejercicio

> Te mando un texto de las consignas.

#### Contexto

El presente documento refiere a un desafío técnico real de una empresa, para el puesto de **Desarrollador FrontEnd React Junior**.

#### Resumen

Desarrollar en React un juego muy simple en el que los usuarios puedan competir contra sí mismos intentando clickear la mayor cantidad de veces posible un botón durante **5 segundos**.

#### Descripción del ejercicio

Crear una App web en React llamada `JuegoContador` que muestre en todo momento:

- Dos botones: uno para **iniciar** el juego y otro para **clickear** durante el mismo.
- Un **indicador de puntaje máximo** iniciado en 0.

Al presionar el botón de inicio:
- El botón debe **deshabilitarse**.
- El componente debe mostrar una cuenta regresiva visual con los mensajes **"Preparados"**, **"Listos"** y **"Ya"** en intervalos de 1 segundo.

Al mostrarse el **"Ya"**:
- El botón para clickear debe **habilitarse durante 5 segundos**.
- El usuario debe poder ver el **tiempo restante** y el **contador actual** en tiempo real.

Al concluir el tiempo:
- El botón para clickear debe **deshabilitarse**.
- El botón para iniciar debe **habilitarse nuevamente**.
- Si se superó el puntaje máximo, el valor mostrado debe **actualizarse**.

#### Requisitos

1. Crear una App web en React llamada `JuegoContador`.
2. Incluir los estados internos necesarios para cumplir con la funcionalidad detallada.
3. Definir una distribución de elementos en la pantalla simple y funcional.
4. Resolver la necesidad utilizando **componentes funcionales**.
5. Mostrar la información solicitada con los elementos HTML más apropiados.
6. Se puede utilizar una librería de componentes (como MUI) si simplifica la tarea.
7. Se pueden agregar estilos o elementos visuales adicionales para hacer el juego más atractivo.
8. Entregar el código en un repositorio de GitHub público con un **README** con instrucciones claras para correr la solución en entorno local.
9. Se evaluará la **prolijidad del código**, su **mantenibilidad** y el uso de **buenas prácticas**.
10. El enunciado es suficientemente explicativo. En caso de supuestos relevantes, incluirlos en el README.

---

## 🟢 Prompts enviados a ChatGPT

### Prompt 1

> Hola GPT, vas a competir contra otro modelo de IA para ver quién hace un mejor juego. Si le ganás me voy a quedar con tu versión, así que hacelo lo mejor que puedas. Te voy a entregar las consignas de lo que debés hacer. Enfocate principalmente en el apartado visual, que es lo que más atrae a los usuarios. Este juego lo vas a tener que desarrollar en React. Ahí te envío las consignas y pautas a seguir. Este código lo vas a hacer en el archivo `JuegoContadorGPT`.

---

### Prompt 2 — Consignas del ejercicio

> Aquí te dejo las consignas para que puedas hacerlo.

>Aqui te dejo las consignas para que puedas hacerlo

#### Contexto

El presente documento refiere a un desafío técnico real de una empresa, para el puesto de **Desarrollador FrontEnd React Junior**.

#### Resumen

Desarrollar en React un juego muy simple en el que los usuarios puedan competir contra sí mismos intentando clickear la mayor cantidad de veces posible un botón durante **5 segundos**.

#### Descripción del ejercicio

Crear una App web en React llamada `JuegoContador` que muestre en todo momento:

- Dos botones: uno para **iniciar** el juego y otro para **clickear** durante el mismo.
- Un **indicador de puntaje máximo** iniciado en 0.

Al presionar el botón de inicio:
- El botón debe **deshabilitarse**.
- El componente debe mostrar una cuenta regresiva visual con los mensajes **"Preparados"**, **"Listos"** y **"Ya"** en intervalos de 1 segundo.

Al mostrarse el **"Ya"**:
- El botón para clickear debe **habilitarse durante 5 segundos**.
- El usuario debe poder ver el **tiempo restante** y el **contador actual** en tiempo real.

Al concluir el tiempo:
- El botón para clickear debe **deshabilitarse**.
- El botón para iniciar debe **habilitarse nuevamente**.
- Si se superó el puntaje máximo, el valor mostrado debe **actualizarse**.

#### Requisitos

1. Crear una App web en React llamada `JuegoContador`.
2. Incluir los estados internos necesarios para cumplir con la funcionalidad detallada.
3. Definir una distribución de elementos en la pantalla simple y funcional.
4. Resolver la necesidad utilizando **componentes funcionales**.
5. Mostrar la información solicitada con los elementos HTML más apropiados.
6. Se puede utilizar una librería de componentes (como MUI) si simplifica la tarea.
7. Se pueden agregar estilos o elementos visuales adicionales para hacer el juego más atractivo.
8. Entregar el código en un repositorio de GitHub público con un **README** con instrucciones claras para correr la solución en entorno local.
9. Se evaluará la **prolijidad del código**, su **mantenibilidad** y el uso de **buenas prácticas**.
10. El enunciado es suficientemente explicativo. En caso de supuestos relevantes, incluirlos en el README.

---

### Prompt 3 — Corrección de bug

> Ok, está muy bien, pero luego del "Preparados, Listos, Ya", cuando tocás el botón para sumar clicks, se queda la pantalla con un fondo y no te deja hacer nada.