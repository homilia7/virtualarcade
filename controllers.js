/**
 * controllers.js - Módulos de Entrada: Joystick Físico (Gamepad API),
 * Bluetooth BLE y Mando Remoto desde Celular (WebRTC / BroadcastChannel).
 */

class ArcadeControllerManager {
    constructor() {
        this.gamepadConnected = false;
        this.gamepadIndex = null;
        this.bluetoothDevice = null;
        this.peer = null;
        this.peerConn = null;
        this.roomId = this.generateRoomId();

        // BroadcastChannel para pruebas en misma máquina / pestañas
        this.broadcast = new BroadcastChannel('virtual_arcade_channel');
        this.broadcast.onmessage = (e) => this.handleRemoteMessage(e.data);

        // Iniciar Gamepad loop
        this.initGamepad();

        // Iniciar WebRTC para mando desde celular si está disponible PeerJS
        this.initP2PRoom();
    }

    generateRoomId() {
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `CLAW-${rand}`;
    }

    // ========================================================
    // 1. MÓDULO DE JOYSTICK FÍSICO (GAMEPAD API)
    // ========================================================
    initGamepad() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log('🎮 Gamepad conectado:', e.gamepad.id);
            this.gamepadConnected = true;
            this.gamepadIndex = e.gamepad.index;
            this.showHUDNotification(`🎮 Mando Conectado: ${e.gamepad.id.substring(0, 24)}...`, '#00e5ff');
            this.updateBadge('gamepadBadge', true, '🎮 Mando Físico: ACTIVO');
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('🎮 Gamepad desconectado:', e.gamepad.id);
            this.gamepadConnected = false;
            this.gamepadIndex = null;
            this.showHUDNotification('⚠️ Mando Físico Desconectado', '#ff1744');
            this.updateBadge('gamepadBadge', false, '🎮 Mando Físico: INACTIVO');
        });

        // Loop de lectura a 60 FPS
        const pollGamepad = () => {
            this.readGamepadInput();
            requestAnimationFrame(pollGamepad);
        };
        requestAnimationFrame(pollGamepad);
    }

    readGamepadInput() {
        if (!navigator.getGamepads) return;
        const gamepads = navigator.getGamepads();
        if (!gamepads) return;

        let activePad = null;
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                activePad = gamepads[i];
                break;
            }
        }

        if (!activePad || !window.clawGame) return;

        // Eje X de la palanca izquierda (Stick Analógico)
        const axisX = activePad.axes[0] || 0;
        // D-Pad Flechas
        const dpadLeft = activePad.buttons[14] && activePad.buttons[14].pressed;
        const dpadRight = activePad.buttons[15] && activePad.buttons[15].pressed;

        const isLeft = axisX < -0.3 || dpadLeft;
        const isRight = axisX > 0.3 || dpadRight;

        if (isLeft && !window.clawGame.moveLeft) {
            window.clawGame.moveLeft = true;
            window.clawGame.moveRight = false;
            window.clawGame.tiltJoystick(-1);
        } else if (isRight && !window.clawGame.moveRight) {
            window.clawGame.moveRight = true;
            window.clawGame.moveLeft = false;
            window.clawGame.tiltJoystick(1);
        } else if (!isLeft && !isRight && (window.clawGame.moveLeft || window.clawGame.moveRight)) {
            window.clawGame.moveLeft = false;
            window.clawGame.moveRight = false;
            window.clawGame.tiltJoystick(0);
        }

        // Botones de Acción (A / X / Gatillo / Espacio)
        const btnCatch = (activePad.buttons[0] && activePad.buttons[0].pressed) ||
                         (activePad.buttons[1] && activePad.buttons[1].pressed) ||
                         (activePad.buttons[7] && activePad.buttons[7].pressed);

        if (btnCatch && !this.wasCatchPressed) {
            this.wasCatchPressed = true;
            window.clawGame.triggerGrab();
        } else if (!btnCatch) {
            this.wasCatchPressed = false;
        }

        // Botón Insertar Moneda (Select / Start)
        const btnCoin = (activePad.buttons[8] && activePad.buttons[8].pressed) ||
                        (activePad.buttons[9] && activePad.buttons[9].pressed);

        if (btnCoin && !this.wasCoinPressed) {
            this.wasCoinPressed = true;
            window.clawGame.insertCoin();
        } else if (!btnCoin) {
            this.wasCoinPressed = false;
        }
    }

    // ========================================================
    // 2. MÓDULO WEB BLUETOOTH API
    // ========================================================
    async connectBluetooth() {
        if (!navigator.bluetooth) {
            alert('⚠️ La Web Bluetooth API no es soportada en este navegador. Utiliza Google Chrome o Edge en Windows, Android o Mac.');
            return;
        }

        try {
            this.showHUDNotification('📡 Buscando dispositivos Bluetooth cercanos...', '#ffd600');
            
            // Solicitar dispositivo BLE (Mandos, ESP32 Arcade o periféricos HID)
            this.bluetoothDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['generic_access', 'battery_service', 'human_interface_device']
            });

            console.log('📡 Dispositivo Bluetooth seleccionado:', this.bluetoothDevice.name);
            this.showHUDNotification(`✅ Conectado a Bluetooth: ${this.bluetoothDevice.name || 'Dispositivo Desconocido'}`, '#76ff03');
            this.updateBadge('bluetoothBadge', true, `📡 BLE: ${this.bluetoothDevice.name || 'Activo'}`);

            this.bluetoothDevice.addEventListener('gattserverdisconnected', () => {
                this.showHUDNotification('⚠️ Dispositivo Bluetooth Desconectado', '#ff1744');
                this.updateBadge('bluetoothBadge', false, '📡 Bluetooth: INACTIVO');
            });

        } catch (error) {
            console.log('Bluetooth cancelado o error:', error);
            if (error.name !== 'NotFoundError') {
                this.showHUDNotification(`Error Bluetooth: ${error.message}`, '#ff1744');
            }
        }
    }

    // ========================================================
    // 3. MÓDULO DE CONTROL DESDE CELULAR (QR & WebRTC / Broadcast)
    // ========================================================
    initP2PRoom() {
        // Cargar PeerJS dinámicamente para conexión P2P móvil sin servidor
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';
        script.onload = () => {
            this.setupPeerServer();
        };
        document.head.appendChild(script);
    }

    setupPeerServer() {
        try {
            const peerId = `va-${this.roomId.toLowerCase()}`;
            this.peer = new Peer(peerId);

            this.peer.on('open', (id) => {
                console.log('🌐 Servidor P2P Arcade listo con ID:', id);
                this.updateQRModal();
            });

            this.peer.on('connection', (conn) => {
                console.log('📱 ¡Celular conectado vía P2P!');
                this.peerConn = conn;
                this.showHUDNotification('📱 ¡Celular Conectado como Mando Remoto!', '#76ff03');
                this.updateBadge('mobileBadge', true, '📱 Celular: VINCULADO');

                conn.on('data', (data) => {
                    this.handleRemoteMessage(data);
                });

                conn.on('close', () => {
                    this.showHUDNotification('📱 Celular desconectado', '#ff1744');
                    this.updateBadge('mobileBadge', false, '📱 Celular: DESCONECTADO');
                });
            });

            this.peer.on('error', (err) => {
                console.warn('PeerJS notice:', err);
            });
        } catch (e) {
            console.error('Error iniciando PeerJS:', e);
        }
    }

    handleRemoteMessage(data) {
        if (!data || !window.clawGame) return;

        switch (data.action) {
            case 'MOVE':
                if (data.dir === -1) {
                    window.clawGame.moveLeft = true;
                    window.clawGame.moveRight = false;
                    window.clawGame.tiltJoystick(-1);
                } else if (data.dir === 1) {
                    window.clawGame.moveRight = true;
                    window.clawGame.moveLeft = false;
                    window.clawGame.tiltJoystick(1);
                } else {
                    window.clawGame.moveLeft = false;
                    window.clawGame.moveRight = false;
                    window.clawGame.tiltJoystick(0);
                }
                break;
            case 'CATCH':
                window.clawGame.triggerGrab();
                break;
            case 'COIN':
                window.clawGame.insertCoin();
                break;
        }
    }

    updateQRModal() {
        const qrContainer = document.getElementById('qrCodeContainer');
        const urlEl = document.getElementById('mobileControllerUrl');
        const roomEl = document.getElementById('roomCodeDisplay');

        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const controllerUrl = `${baseUrl}controller.html?room=${this.roomId}`;

        if (urlEl) urlEl.textContent = controllerUrl;
        if (roomEl) roomEl.textContent = this.roomId;

        if (qrContainer) {
            // Renderizar código QR utilizando la API gratuita de QR de Google Chart o QR Server
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(controllerUrl)}&color=00e5ff&bgcolor=0b0e17`;
            qrContainer.innerHTML = `<img src="${qrApiUrl}" alt="QR Código de Conexión" style="border-radius: 12px; border: 2px solid #00e5ff; box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);">`;
        }
    }

    // ========================================================
    // NOTIFICACIONES HUD EN PANTALLA
    // ========================================================
    showHUDNotification(text, color = '#00e5ff') {
        let hud = document.getElementById('controllerHudToast');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'controllerHudToast';
            hud.style.cssText = `
                position: fixed;
                top: 75px;
                right: 20px;
                background: rgba(11, 14, 23, 0.95);
                backdrop-filter: blur(8px);
                border: 2px solid ${color};
                color: #fff;
                padding: 10px 18px;
                border-radius: 30px;
                font-size: 0.82rem;
                font-weight: 800;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
                z-index: 9999;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
                transform: translateY(-20px);
                opacity: 0;
            `;
            document.body.appendChild(hud);
        }

        hud.textContent = text;
        hud.style.borderColor = color;
        hud.style.transform = 'translateY(0)';
        hud.style.opacity = '1';

        clearTimeout(this.hudTimeout);
        this.hudTimeout = setTimeout(() => {
            hud.style.transform = 'translateY(-20px)';
            hud.style.opacity = '0';
        }, 3500);
    }

    updateBadge(id, active, text) {
        const badge = document.getElementById(id);
        if (badge) {
            badge.textContent = text;
            badge.style.borderColor = active ? '#76ff03' : '#334155';
            badge.style.color = active ? '#76ff03' : '#94a3b8';
        }
    }
}

// Inicializar y enlazar botones en DOM
window.addEventListener('DOMContentLoaded', () => {
    window.controllerManager = new ArcadeControllerManager();

    // Botón Bluetooth
    const btnBluetooth = document.getElementById('btnConnectBluetooth');
    if (btnBluetooth) {
        btnBluetooth.addEventListener('click', () => {
            window.controllerManager.connectBluetooth();
        });
    }

    // Modal QR Móvil
    const btnMobileQR = document.getElementById('btnConnectMobile');
    const modalQR = document.getElementById('mobileQRModal');
    const btnCloseQR = document.getElementById('btnCloseQRModal');

    if (btnMobileQR && modalQR) {
        btnMobileQR.addEventListener('click', () => {
            window.controllerManager.updateQRModal();
            modalQR.classList.add('active');
        });
    }
    if (btnCloseQR && modalQR) {
        btnCloseQR.addEventListener('click', () => {
            modalQR.classList.remove('active');
        });
    }
});
