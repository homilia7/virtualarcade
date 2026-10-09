# 📜 HISTORIAL DE CAMBIOS APROBADOS — VIRTUAL ARCADE

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** [https://github.com/homilia7/virtualarcade](https://github.com/homilia7/virtualarcade)
- **Rama:** main
- **Commit:** 3a50926
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

---

## 📦 ENTRADA: Versión 1.5.0 - Depósito 3D Iluminado, Apertura de Garra en Descenso y Vitrina Cristal Despejada

### Funcionalidades Implementadas:
1. **Depósito / Tolva 3D de Premios de Alta Visibilidad:**
   - Brocal de la tolva elevado y visible en la esquina frontal izquierda (`Y = -2.6` a `-1.55`), perfectamente observable sobre la consola de mandos.
   - Marco perimetral con iluminación LED Neón Cian intensa (`0x00e5ff`, emissive 0.85) que resalta claramente el orificio de caída de los premios.
   - Túnel interior profundo con luz puntual cian dedicada (`PointLight` de 1.8 de intensidad) que otorga sensación de profundidad real al conducto.
   - Rótulo frontal 3D iluminado "PREMIOS" y barandilla superior de neón sobre el separador acrílico protector (`Y = -0.95`).
   - Nueva compuerta física en el mueble exterior inferior (`.prize-dispenser-door`) con animación de brillo dorado intermitente (`.glow-win`) al conseguir un premio.

2. **Cinemática de Apertura de la Garra en Descenso:**
   - Estado de reposo relajado configurado a `targetClawAngle = 0.15` (semicerrada en espera).
   - Al pulsar "¡ATRAPAR!" (`triggerGrab()`) y entrar en estado `DROPPING`, la garra se **abre amplia y dramáticamente** a `targetClawAngle = 1.0` en su camino hacia abajo.
   - El vástago del pistón central neumático se extiende hacia abajo mientras los 3 brazos mecánicos y bielas se abren en abanico con un span superior a 2.4 unidades.
   - Al tocar la montaña de comida (`clawPos.y <= -2.4`), se cierra con fuerza a `0.05` sujetando el producto.
   - Al alcanzar el depósito (`RELEASING`), se abre completamente a `1.0` dejando caer la comida dentro del conducto iluminado y regresa suavemente a `0.15` en reposo.

3. **Vitrina de Cristal 100% Despejada:**
   - Se removió el texto central superpuesto en el cristal ("VIRTUAL CLAW CADE") que obstruía la visión hacia los premios y la garra, ofreciendo una visualización limpia y nítida de nivel exposición comercial.

---

## 📦 ENTRADA: Versión 1.6.0 - Garra 100% Color Plata Real y Eliminación de Elementos Flotantes

### Funcionalidades Implementadas:
1. **Garra Metálica 100% Color Plata Cromada Realista:**
   - Se eliminaron todos los componentes plásticos o de colores no metálicos (cúpula rosa neón, acero mate oscuro, pernos dorados y punteras negras sueltas).
   - Acabado homogéneo de plata pulida espejo (`silverChromeMat`: metalness 0.98, roughness 0.08) y acero inoxidable color plata (`silverSteelMat`).
   - Cúpula superior, casquillo cónico, carcasa cilíndrica del motor, anillo estriado, buje central y brazos articulados modelados íntegramente en plata cromada de alta fidelidad, con reflejos y brillos metálicos auténticos como en las máquinas recreativas reales.

2. **Eliminación Total de Elementos Flotantes bajo la Garra:**
   - **En la garra:** Se eliminaron las bielas y varillas diagonales desconectadas (`linkageRod`) y el vástago/collar colgante que flotaban en el aire debajo de la cabeza de la garra, logrando una silueta mecánica limpia y sólida de 3 brazos articulados continuos.
   - **En la piscina de premios:** Se reestructuró la distribución de los productos 3D en 2 capas continuas asentadas sólidamente sobre el suelo (`Y = -4.32` y `-3.55`). Se eliminó la dispersión en altura que dejaba comida suspendida en el aire en el centro, garantizando un espacio vertical completamente despejado entre los alimentos y la garra.

---

## 📦 ENTRADA: Versión 1.7.0 - Tenazas Mecánicas Continuas Monolíticas de Plata Real Radiante

### Funcionalidades Implementadas:
1. **Erradicación Definitiva de Segmentos Desconectados / Elementos Flotantes:**
   - Cada una de las 3 tenazas fue reconstruida como una **curva 3D continua indivisible** (`THREE.CatmullRomCurve3` extruida con `THREE.TubeGeometry`), fusionando en una sola pieza geométrica el anclaje superior, el brazo descendente, el codo articulado exterior y la punta curvada hacia el centro.
   - Se eliminaron por completo los 4 cilindros, bielas y conos independientes que se separaban en el aire al rotar. Es físicamente imposible que existan huecos, holguras o elementos flotantes en la garra.
   - Se integró un perno de articulación cilíndrico de plata en el pivote superior, refuerzo en el codo y una terminación cóncava suave en la punta, todo emparentado rígidamente al pivote único (`upperPivot`).

2. **Acabado Metálico de Plata Pura Radiante y Brillante:**
   - Se calibraron los materiales PBR de Three.js (`silverChromeMat`, `silverSteelMat`, `silverBoltMat`) con `metalness: 0.45`, `roughness: 0.14` y luminiscencia plateada sutil (`emissive: 0x303844`), resolviendo la falta de environment map que hacía que la garra se viera negra u oscura.
   - Se incorporó un foco direccional frontal dedicado (`clawFrontLight` de intensidad 1.8 en `Y=6, Z=9`) orientado de frente a la máquina, logrando destellos cromados especulares nítidos y un color plateado brillante idéntico a las garras de acero inoxidable de ferias y arcades.

3. **Cinemática Suave y Agarre Optimizado:**
   - Apertura en abanico suave y controlada de las 3 tenazas al descender (`targetClawAngle = 1.0`, envergadura > 2.8 unidades).
   - Altura de contacto de descenso ajustada a `clawPos.y <= -1.6` para que las puntas de plata alcancen la profundidad exacta de la comida sobre el suelo (`Y = -4.37`) sin atravesar el chasis.
   - Centro de sujeción vertical calibrado a `clawPos.y - 1.65` para que la hamburguesa, papas o tacos queden abrazados dentro de las tenazas de plata durante la elevación y traslado a la tolva.

---

## 📦 ENTRADA: Versión 1.8.0 - Acabado Metálico Real con IBL de Estudio, Cadena de Acero 3D y Modelos Gourmet Fotorrealistas en Alta Resolución

### Funcionalidades Implementadas:
1. **Acabado Metálico Realista con Iluminación IBL de Estudio (`scene.environment`):**
   - Se implementó un generador procedural de entorno de estudio HD (`initStudioEnvironment`) utilizando `PMREMGenerator` y canvas equirectangular.
   - Reflejos auténticos en tiempo real de softboxes de estudio, línea de horizonte cromada y resplandores neón laterales sobre las superficies metálicas.
   - Materiales `silverChromeMat` (metalness: 0.95, roughness: 0.10) y `silverSteelMat` (metalness: 0.88) que ofrecen un brillo de espejo y acabado de acero pulido idéntico al de una máquina recreativa física real.

2. **Cadena Metálica 3D de Eslabones Entrelazados Reales (`InstancedMesh`):**
   - Se reemplazó el cilindro liso de cable por una **cadena tridimensional de 44 eslabones ovalados de acero cromado** (`THREE.TorusGeometry` escalado a eslabón oval).
   - Los eslabones se entrelazan físicamente alternando 0° y 90° en el eje Y.
   - La cadena se estira y recoge dinámicamente eslabón por eslabón a medida que la garra desciende y asciende, reflejando destellos cromados reales en cada anillo.

3. **Modelos 3D de Comida Gourmet de Alta Resolución y Realismo:**
   - **Hamburguesa Doble Gourmet:** Pan brioche abombado glaseado con 12 racimos de semillas de sésamo orientadas, carne Angus gruesa a la parrilla, cheddar derretido con 4 esquinas caídas sobre la carne, pepinillos agridulces, rodajas de tomate y 7 hojas de lechuga rizada batavia.
   - **Papas Fritas Crujientes:** Caja cónica trapezoidal de fast-food con scoop frontal rebajado, emblema arcade dorado y 22 papas doradas con variación cromática de fritura y tostado.
   - **Taco al Pastor Supremo:** Tortilla de maíz doblada con puntos de comal artesanal, cama abundante de carne al pastor marinada en achiote, cubos de piña asada, cebolla blanca, cilantro fresco y gajo de limón verde.
   - **Empanada Criolla Dorada:** Masa hojaldrada inflada con vientre relleno, repulgue tradicional de 16 pliegues entrelazados y barniz de huevo horneado con satin gloss.
   - **Dona Gourmet Glaseada:** Masa frita esponjosa con cinta de fritura ecuatorial dorada, glaseado espejo espeso de fresa con 8 gotas orgánicas escurriendo, 32 chispas multicolores y espirales de chocolate blanco.

4. **Mejora Integral de Resolución y Calidad de Renderizado:**
   - Soporte para pantallas Retina y monitores de alta densidad con `pixelRatio` hasta 2.5x.
   - Mapeo tonal cinematográfico `ACESFilmicToneMapping` y codificación de color `sRGBEncoding` para evitar colores lavados o aspecto plástico.
   - Sombras suaves en tiempo real duplicadas en resolución a `2048x2048` píxeles.
   - Aumento de altura de la vitrina de cristal a `500px` en modo estándar para mayor amplitud visual.

---

## 📦 ENTRADA: Versión 1.8.1 - Calibración Cromática de Plata Real Metálica (Eliminación de Sobreexposición Blanca)

### Funcionalidades Implementadas:
1. **Calibración de Tono Plata Metálico Auténtico:**
   - Se ajustó la base de color de la garra de blanco (`0xf8fafc`) a un tono de plata pura / acero pulido con contraste profundo (`0x758595`).
   - Se calibró la reflectividad física (`metalness: 0.90`, `roughness: 0.16`, `envMapIntensity: 0.95`), permitiendo que el cuerpo de la garra mantenga su color plateado metálico característico mientras proyecta destellos nítidos en las aristas y curvas.
2. **Control de Iluminación y Exposición:**
   - Se redujo el foco direccional frontal (`clawFrontLight` de 1.6 a 0.50) y el foco cenital (`1.45`), evitando que la luz frontal queme la superficie convirtiéndola en blanco plano.
   - Se ajustó la exposición del mapeo tonal a `1.0`.
   - Se refinó el mapa de entorno de estudio con tiras lineales de luz finas en lugar de bloques masivos, generando destellos de cromo finos y elegantes.






