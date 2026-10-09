# 📜 HISTORIAL DE CAMBIOS APROBADOS — VIRTUAL ARCADE

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** [https://github.com/homilia7/virtualarcade](https://github.com/homilia7/virtualarcade)
- **Rama:** main
- **Commit:** dfef2f2
- **URL Producción:** [https://virtualarcade-duz.pages.dev](https://virtualarcade-duz.pages.dev)

---

## 📦 ENTRADA INICIAL: Versión 1.0.0 - Lanzamiento de Virtual Clawcade & Plataforma Comercial

### Funcionalidades Implementadas:
1. **Máquina de Garra Virtual 3D Estilo Arcade ("Virtual Clawcade"):**
   - Chasis magenta/candy con columnas de luz LED neón cian idéntico al mueble físico de exhibición en eventos.
   - Montaña volumétrica densa de peluches y premios superpuestos con física de profundidad y colisiones.
   - Barrera acrílica transparente divisoria para la rampa de premios lateral.
   - Consola de control 3D integrada con palanca física de bola roja que se inclina dinámicamente, botones de domo iluminados y ranura de monedas/billetes `$`.
   - Modos temáticos intercambiables: **Peluches & Golosinas para Eventos** y **Gourmet & Comida para Restaurantes**.
   - Modo Kiosco / Pantalla Completa Vertical optimizado para Smart TVs y monitores de pared.

2. **Plataforma Comercial para Negocios:**
   - Presentación de soluciones para restaurantes (fidelización y recompra) y eventos (alquiler de máquinas virtuales ligeras).
   - Guía técnica de hardware (tótems, pantallas verticales y joysticks arcade USB de $20 USD).
   - Calculadora de rentabilidad y cotizador directo.

3. **Despliegue y CI/CD:**
   - Despliegue en Cloudflare Pages (`virtualarcade.pages.dev`).
   - Sincronización continua con repositorio en GitHub (`homilia7/virtualarcade`).

---

## 📦 ENTRADA: Versión 1.1.0 - Módulos de Entrada: Joystick Físico, Bluetooth BLE y Control Remoto Celular

### Funcionalidades Implementadas:
1. **Módulo de Joystick Físico (Gamepad API):**
   - Detección automática en tiempo real de mandos USB Arcade (Zero Delay USB Encoder), mandos de Xbox, PlayStation y Nintendo Switch.
   - Mapeo nativo de palanca analógica izquierda / D-Pad para movimiento horizontal de la garra.
   - Mapeo de botones de acción (A / X / Gatillo) para "¡ATRAPAR!" y botones Select/Start para inserción de fichas.
   - Notificaciones HUD y badges de estado en pantalla.

2. **Módulo de Web Bluetooth API (BLE):**
   - Vinculación directa desde el navegador con mandos inalámbricos Bluetooth y microcontroladores (ESP32/Arduino).

3. **Módulo de Control Remoto Móvil sin Apps (QR + WebRTC / Broadcast):**
   - Pantalla interactiva en `controller.html` con palanca analógica táctil, botón grande de acción con vibración háptica y botón de créditos.
   - Generación de código QR y sala dinámica (`CLAW-XXXX`) para que los clientes en ferias o eventos controlen la pantalla de TV desde su teléfono sin tocarla.

