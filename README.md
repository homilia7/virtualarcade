# 🕹️ La Máquina del Sabor (Arcade Gourmet)

Prototipo interactivo de alta fidelidad de **Máquina de Garra Gourmet**, diseñado tanto para **fidelización post-compra en restaurantes** como para **máquinas virtuales interactivas con pantalla y joystick para eventos y fiestas**.

---

## 🚀 Cómo Ejecutar y Probar el Prototipo

1. Haz doble clic en [`index.html`](./index.html) para abrirlo directamente en tu navegador (Google Chrome, Edge, Safari, Firefox).
2. O ejecuta un servidor local con PowerShell:
   ```powershell
   npx serve .
   ```
   o con Python:
   ```powershell
   python -m http.server 8080
   ```
   y abre `http://localhost:8080` en tu navegador.

---

## 🎮 Controles de Juego

| Acción | Controles en Pantalla | Teclado Físico / Arcade |
| :--- | :--- | :--- |
| **Insertar Ficha / Ticket** | Botón `🎟️ INSERTAR TICKET / JUGAR` | Clic |
| **Mover Garra a la Izquierda** | Botón `◀` | Flecha Izquierda `←` o Tecla `A` |
| **Mover Garra a la Derecha** | Botón `▶` | Flecha Derecha `→` o Tecla `D` |
| **Atrapar Platillo** | Botón Rojo `¡ATRAPAR!` | Barra espaciadora `[ESPACIO]` o `[ENTER]` |
| **Sonido** | Botón `🔊` / `🔇` | Clic |
| **Ajustes de Restaurante** | Botón `⚙️` (Esquina superior derecha) | Clic |

---

## 🍕 Mecánica y Características Culinarias

* **Vitrina Gastronómica:** Platillos apetitosos con iluminación focal (*Mega Burger Doble, Papas Trufadas, Tacos al Pastor, Pizza 4 Quesos, Helado Sundae, Bebida Gigante, Dona Glaseada y Cupones 50% OFF*).
* **Cinemática Realista:** Carro superior (*Trolley*), cable de tensión elástica y tenazas articuladas metálicas con puntas de goma antideslizante.
* **Sonido Sintetizado Nativo:** Web Audio API sin necesidad de descargar archivos `.mp3` (moneda arcade, motor de riel, descenso de cable, clack metálico, fanfarria de victoria).
* **Ticket Digital de Canje:** Al ganar, la rampa de entrega se ilumina, explota confeti y se despliega un cupón de restaurante con código único (`SABOR-XXXX`) y temporizador de 15 minutos para canje en caja o mesa.

---

## ⚙️ Panel de Control del Restaurante (Antifraude y Costos)

Al presionar el botón `⚙️` en la marquesina superior, accedes al panel donde puedes configurar:
1. **Nombre del Restaurante / Negocio:** Personalizable al instante.
2. **Probabilidad de Victoria:**
   * **100% (Modo Demo / Fiestas Infantiles):** Todos los niños o invitados ganan siempre su golosina.
   * **85% (Fidelización Alta):** Recompensa frecuente para restaurantes con premios de bajo costo (ej. bebida o postre).
   * **50% (Balanceada):** 1 de cada 2 intentos exitosos.
   * **25% (Control Estricto de Stock):** Para premios de alto valor (ej. combos familiares o 50% OFF).

---

## 🎪 Adaptación para el Negocio de Fiestas y Eventos (Con Joystick Físico)

Para transformar este software en un arcade de alquiler para eventos:
1. **Pantalla:** Coloca una pantalla o TV de 32" o 43" en posición vertical (resolución 1080x1920) conectada a una mini-PC o Raspberry Pi.
2. **Controles Físicos:** Conecta un kit de palanca y botones Arcade USB (Zero Delay USB Encoder):
   * La palanca envía `Flecha Izquierda` y `Flecha Derecha`.
   * El botón envía `Barra Espaciadora`.
3. **Impresora Térmica (Opcional):** Puedes conectar una mini-impresora térmica USB ($25 USD) que imprima el ticket físico al ganar para que los niños lo canjeen en la mesa de dulces o bar de la fiesta.
