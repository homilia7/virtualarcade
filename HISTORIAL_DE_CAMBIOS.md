# 📜 HISTORIAL DE CAMBIOS APROBADOS — VIRTUAL ARCADE

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** [https://github.com/homilia7/virtualarcade](https://github.com/homilia7/virtualarcade)
- **Rama:** main
- **Commit:** 7474462
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

---

## 📦 ENTRADA: Versión 1.2.0 - Migración Completa a Motor 3D Real (Three.js / WebGL)

### Funcionalidades Implementadas:
1. **Motor Three.js WebGL a 60 FPS:**
   - Escena tridimensional con cámara en perspectiva (`PerspectiveCamera`), iluminación PBR y sombras arrojadas dinámicas (`PCFSoftShadowMap`).
   - Foco cenital `SpotLight` con seguimiento de la garra y luces puntuales Neón Cian y Neón Magenta en los pilares laterales.
   - Materiales cromados de alta reflectividad para los rieles y cables, y material acrílico transparente físico con transmisión de luz para la rampa de caída.

2. **Rieles Superiores y Movimiento Tridimensional en 3 Ejes (X, Y, Z):**
   - La garra se desplaza en el plano horizontal en **X (Izquierda / Derecha)** y en **Z (Fondo / Adelante)** hacia el fondo del gabinete.
   - Descenso vertical en **Y** con sujeción tridimensional.
   - Tenazas articuladas mecánicas compuestas por 3 brazos a 120° con cúpula hemisférica rosa neón idéntica a la máquina física de exhibición.

3. **Montaña Volumétrica de Peluches 3D:**
   - Más de 60 esferas y modelos tridimensionales con orejitas y sombras físicas apiladas en el suelo del gabinete con física de contacto.
   - Soporte para mando físico (gamepad analógico en 2 ejes), flechas de teclado (↑, ↓, ←, → / WASD) y thumbstick virtual del celular en 360 grados.

---

## 📦 ENTRADA: Versión 1.3.0 - Garra Metálica Industrial de Alta Fidelidad y Cinemática Real

### Funcionalidades Implementadas:
1. **Modelado Mecánico Industrial en Acero y Cromo:**
   - Carcasa central de acero oscuro con anillo estriado cromado y anilla superior de suspensión giratoria.
   - Vástago de pistón central vertical deslizable acoplado a un collar inferior de 3 vías.
   - 3 brazos articulados de doble placa de acero cromado con pernos hexagonales de latón dorado.
   - Bielas de articulación (linkage rods) conectadas entre el pistón central y los brazos superiores en mecanismo de tijera.
   - Pinzas inferiores curvadas de acero inoxidable con punteras cónicas de alta precisión y almohadillas de goma negra antideslizantes (*grip pads*).

2. **Cinemática Realista de Apertura, Cierre y Balanceo:**
   - Apertura completa de hasta 48 grados con retroceso al iniciar la partida o soltar el premio.
   - Cierre progresivo mecánico al tocar los peluches con descenso simultáneo del pistón central hacia abajo.
   - Física de inercia y balanceo pendular armónico (*Sway Physics*) en los ejes X y Z cuando el carro se desplaza y frena.

---

## 📦 ENTRADA: Versión 1.4.0 - Barra Transversal Superior, Premios 3D Gourmet y Pantalla Completa Exclusiva de Máquina

### Funcionalidades Implementadas:
1. **Corrección de la Barra Transversal (`crossbeam`) y Rieles de Techo:**
   - La viga transversal fue reubicada y anclada permanentemente en el plano superior del techo a `Y = 4.8` sobre los rieles longitudinales.
   - Se agregaron bloques y rodamientos guía laterales en `X = -5.5` y `X = 5.5` para simular la estructura de grúa pórtico industrial.
   - Cinemática del cable de acero trenzado calibrada con precisión milimétrica desde la polea inferior del carro (`Y = 4.6`) hasta la anilla de suspensión superior de la garra (`Y = clawPos.y + 0.95`).
   - Reposo natural de la garra calibrado a `restingY = 3.3` para dejar holgura de cable visible y visibilidad despejada de la vitrina.

2. **Modelos 3D Procedurales de Comida Gourmet Realista:**
   - 🍔 **Hamburguesa Doble:** Pan superior con domo tostado, 9 semillas de sésamo individuales en 3D, queso cheddar fundido con esquinas caídas, rodajas de tomate jugoso, lechuga verde rizada y hamburguesa asada a la parrilla.
   - 🍟 **Papas Fritas:** Caja roja icónica fast-food con franja dorada y 16 bastones crujientes en abanico con tonos dorados naturales e inclinaciones realistas.
   - 🌮 **Tacos al Pastor:** Tortilla de maíz tostado curvada en 'U', carne sazonada al pastor, trozos de piña asada, cilantro picado fresco y hebras de queso.
   - 🥟 **Empanadas Criollas:** Masa dorada horneada en media luna, 13 pliegues de repulgue trenzado artesanal y barniz satinado de huevo horneado.
   - 🍩 **Postres / Donas Gourmet:** Masa esponjosa dorada, cobertura espejo de glaseado de fresa de alta reflectividad y 24 chispas de colores tridimensionales.
   - Montaña de premios 3D poblada automáticamente con estos 5 alimentos por defecto (tema `gourmet`).

3. **Botón de Pantalla Completa Exclusivo de la Máquina Arcade:**
   - Botón nativo de pantalla completa integrado en la marquesina superior del mueble (`.bezel-fullscreen-btn`) y en la barra de herramientas (`btnMachineFullscreen`).
   - Al activarse, solicita Fullscreen API exclusivamente para el elemento de la máquina (`.arcade-cabinet` / `.arcade-viewport`), ocultando todo el sitio web restante y centrando el mueble arcade en proporción 9:16 vertical con fondo negro absoluto, ideal para monitores, Smart TVs y tótems comerciales.
   - Banner y toast celebratorio animado con el emoji y nombre del premio (`#winBannerToast`) al depositar la comida en la rampa de premios.




