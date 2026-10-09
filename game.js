/**
 * game.js - Motor de Física y Gráficos para "Virtual Clawcade"
 * Renderizado de la montaña de peluches volumétrica 3D, separador acrílico y garra idéntica a la imagen.
 */

// Temas de premios disponibles
const THEMES = {
    plushies: [
        { name: 'Peluchetón Rosa', color: '#ff80ab', eye: '🐰', radius: 24 },
        { name: 'Osito Menta', color: '#69f0ae', eye: '🐻', radius: 25 },
        { name: 'Gatito Dorado', color: '#ffd54f', eye: '🐱', radius: 23 },
        { name: 'Conejito Pastel', color: '#ea80fc', eye: '🐰', radius: 24 },
        { name: 'Pollito Solar', color: '#ffee58', eye: '🐥', radius: 22 },
        { name: 'Pulpo Turquesa', color: '#40c4ff', eye: '🐙', radius: 26 },
        { name: 'Panda Suave', color: '#f5f5f5', eye: '🐼', radius: 25 },
        { name: 'Dino Pastel', color: '#b9f6ca', eye: '🦖', radius: 24 },
        { name: 'Zorrito Coral', color: '#ffab91', eye: '🦊', radius: 23 },
        { name: 'Golosina Gigante', color: '#ff4081', eye: '🍬', radius: 22 }
    ],
    gourmet: [
        { name: 'Mega Burger Doble', color: '#ff9800', eye: '🍔', radius: 26 },
        { name: 'Papas Trufadas', color: '#ffd600', eye: '🍟', radius: 24 },
        { name: 'Tacos al Pastor', color: '#4caf50', eye: '🌮', radius: 25 },
        { name: 'Pizza 4 Quesos', color: '#f44336', eye: '🍕', radius: 25 },
        { name: 'Helado Sundae', color: '#29b6f6', eye: '🍨', radius: 24 },
        { name: 'Bebida Gigante', color: '#00e5ff', eye: '🥤', radius: 25 },
        { name: 'Dona Glaseada', color: '#e91e63', eye: '🍩', radius: 23 },
        { name: 'Cupón 50% OFF', color: '#ffb300', eye: '🎟️', radius: 22 }
    ]
};

class VirtualClawcadeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.currentTheme = 'plushies';
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Estado del juego
        this.state = 'WAITING_COIN';
        this.credits = 1; // 1 crédito de bienvenida
        this.timeRemaining = 25;
        this.timerInterval = null;

        // Físicas y Cinemática de la Garra
        this.clawX = this.width / 2;
        this.clawY = 40;
        this.restingY = 40;
        this.clawAngle = 36;
        this.clawTargetAngle = 36;
        this.cableLength = 40;

        // Geometría de la Rampa y el Separador Acrílico
        this.chuteWidth = 92;
        this.acrylicX = 96; // Línea del separador acrílico
        this.minX = this.acrylicX + 25;
        this.maxX = this.width - 35;
        this.floorY = this.height - 40;

        // Controles
        this.moveLeft = false;
        this.moveRight = false;

        // La Montaña de Peluches (Volumétrica)
        this.plushieMountain = [];
        this.grabbedItem = null;
        this.wonItem = null;
        this.confetti = [];

        // Generar montaña inicial
        this.generatePlushieMountain();
        this.bindEvents();

        // Actualizar contador inicial
        this.updateCreditsDisplay();

        // Bucle 60 FPS
        requestAnimationFrame((t) => this.loop(t));
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.width = rect.width;
        this.height = rect.height;

        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.floorY = this.height - 35;
        this.minX = this.acrylicX + 25;
        this.maxX = this.width - 35;
    }

    /**
     * Genera una densa pila/montaña de peluches apilados en 3 capas
     * dando la textura y volumen idénticos a la máquina física de la foto.
     */
    generatePlushieMountain() {
        this.plushieMountain = [];
        const itemsPool = THEMES[this.currentTheme];

        const startX = this.acrylicX + 10;
        const availableWidth = this.width - startX - 10;

        // Capa 1 (Fondo/Base - más oscuros y profundos)
        for (let x = startX; x < this.width - 15; x += 36) {
            const proto = itemsPool[Math.floor(Math.random() * itemsPool.length)];
            this.plushieMountain.push({
                ...proto,
                x: x + (Math.random() * 12 - 6),
                y: this.floorY - 10 + (Math.random() * 8),
                layer: 1,
                scale: 0.9,
                rot: (Math.random() - 0.5) * 0.4
            });
        }

        // Capa 2 (Media - el cuerpo de la montaña)
        for (let x = startX + 12; x < this.width - 20; x += 38) {
            const proto = itemsPool[Math.floor(Math.random() * itemsPool.length)];
            this.plushieMountain.push({
                ...proto,
                x: x + (Math.random() * 10 - 5),
                y: this.floorY - 38 + (Math.random() * 12),
                layer: 2,
                scale: 1.0,
                rot: (Math.random() - 0.5) * 0.5
            });
        }

        // Capa 3 (Cima / Superficie interactiva que la garra puede tocar)
        for (let x = startX + 20; x < this.width - 30; x += 42) {
            const proto = itemsPool[Math.floor(Math.random() * itemsPool.length)];
            this.plushieMountain.push({
                ...proto,
                x: x + (Math.random() * 14 - 7),
                y: this.floorY - 70 + (Math.random() * 14),
                layer: 3,
                scale: 1.05,
                rot: (Math.random() - 0.5) * 0.6,
                grabbed: false,
                isTopTarget: true
            });
        }
    }

    bindEvents() {
        // Inserción de Monedas / Billetes
        const coinSlot = document.getElementById('billCoinSlot');
        if (coinSlot) {
            coinSlot.addEventListener('click', () => this.insertCoin());
        }

        // Botón ATRAPAR (Domo Rojo)
        const btnCatch = document.getElementById('btnCatch3D');
        if (btnCatch) {
            btnCatch.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.triggerGrab();
            });
        }

        // Joystick 3D Interactivo
        const joystickBall = document.getElementById('joystickBall');
        const joystickStation = document.getElementById('joystickStation');

        let isDraggingJoystick = false;
        let startX = 0;

        const handleMoveStart = (clientX) => {
            if (this.state !== 'READY') return;
            isDraggingJoystick = true;
            startX = clientX;
        };

        const handleMoveDrag = (clientX) => {
            if (!isDraggingJoystick || this.state !== 'READY') return;
            const deltaX = clientX - startX;
            if (deltaX < -15) {
                this.moveLeft = true;
                this.moveRight = false;
                this.tiltJoystick(-1);
            } else if (deltaX > 15) {
                this.moveRight = true;
                this.moveLeft = false;
                this.tiltJoystick(1);
            } else {
                this.moveLeft = false;
                this.moveRight = false;
                this.tiltJoystick(0);
            }
        };

        const handleMoveEnd = () => {
            isDraggingJoystick = false;
            this.moveLeft = false;
            this.moveRight = false;
            this.tiltJoystick(0);
        };

        if (joystickStation) {
            joystickStation.addEventListener('pointerdown', (e) => handleMoveStart(e.clientX));
            window.addEventListener('pointermove', (e) => handleMoveDrag(e.clientX));
            window.addEventListener('pointerup', handleMoveEnd);
            window.addEventListener('pointercancel', handleMoveEnd);
        }

        // Teclado Físico / Arcade USB Encoder
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.moveLeft = true;
                this.tiltJoystick(-1);
            } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.moveRight = true;
                this.tiltJoystick(1);
            } else if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.triggerGrab();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.moveLeft = false;
                this.tiltJoystick(0);
            } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.moveRight = false;
                this.tiltJoystick(0);
            }
        });

        // Alternar Temas (Peluches vs Gourmet)
        const btnThemePlushies = document.getElementById('btnThemePlushies');
        const btnThemeGourmet = document.getElementById('btnThemeGourmet');

        if (btnThemePlushies && btnThemeGourmet) {
            btnThemePlushies.addEventListener('click', () => {
                this.currentTheme = 'plushies';
                btnThemePlushies.classList.add('active');
                btnThemeGourmet.classList.remove('active');
                this.generatePlushieMountain();
            });

            btnThemeGourmet.addEventListener('click', () => {
                this.currentTheme = 'gourmet';
                btnThemeGourmet.classList.add('active');
                btnThemePlushies.classList.remove('active');
                this.generatePlushieMountain();
            });
        }

        // Modo Kiosco Smart TV
        const btnToggleKiosk = document.getElementById('btnToggleKiosk');
        if (btnToggleKiosk) {
            btnToggleKiosk.addEventListener('click', () => {
                document.body.classList.toggle('tv-kiosk-mode');
                setTimeout(() => this.resize(), 100);
            });
        }
    }

    tiltJoystick(dir) {
        const ball = document.getElementById('joystickBall');
        if (!ball) return;
        if (dir < 0) {
            ball.style.transform = 'rotate(-24deg) translateX(-12px) scale(0.98)';
        } else if (dir > 0) {
            ball.style.transform = 'rotate(24deg) translateX(12px) scale(0.98)';
        } else {
            ball.style.transform = 'rotate(0deg) translateX(0px) scale(1)';
        }
    }

    insertCoin() {
        if (window.soundFX) window.soundFX.playCoin();
        this.credits++;
        this.updateCreditsDisplay();

        if (this.state === 'WAITING_COIN') {
            this.state = 'READY';
            this.clawTargetAngle = 36;
        }
    }

    updateCreditsDisplay() {
        const el = document.getElementById('creditsCount');
        if (el) el.textContent = `${this.credits} CRED`;
        if (this.credits > 0 && this.state === 'WAITING_COIN') {
            this.state = 'READY';
        }
    }

    triggerGrab() {
        if (this.state !== 'READY' || this.credits <= 0) return;

        this.credits--;
        this.updateCreditsDisplay();
        this.state = 'DROPPING';
        if (window.soundFX) window.soundFX.playCableDrop();

        const btnCatch = document.getElementById('btnCatch3D');
        if (btnCatch) btnCatch.classList.add('pressed');
        setTimeout(() => {
            if (btnCatch) btnCatch.classList.remove('pressed');
        }, 150);
    }

    update() {
        // Movimiento horizontal en modo LISTO
        if (this.state === 'READY') {
            if (this.moveLeft) {
                this.clawX = Math.max(this.minX, this.clawX - 3.8);
                if (window.soundFX) window.soundFX.playMotor();
            }
            if (this.moveRight) {
                this.clawX = Math.min(this.maxX, this.clawX + 3.8);
                if (window.soundFX) window.soundFX.playMotor();
            }
        }

        // Descenso hacia la cima de la montaña
        if (this.state === 'DROPPING') {
            this.clawY += 4.5;
            // Altura de contacto con la montaña
            const contactY = this.floorY - 82;

            if (this.clawY >= contactY) {
                this.clawY = contactY;
                this.state = 'GRABBING';
                this.clawTargetAngle = 8; // Cerrar tenazas
                if (window.soundFX) window.soundFX.playClawGrab();

                // Chequear colisión con el peluche más cercano de la cima
                this.detectPlushieGrab();
            }
        }

        // Cierre de tenazas
        if (this.state === 'GRABBING') {
            if (Math.abs(this.clawAngle - this.clawTargetAngle) < 2) {
                this.state = 'LIFTING';
            }
        }

        // Elevación con el premio
        if (this.state === 'LIFTING') {
            this.clawY -= 3.2;

            if (this.grabbedItem) {
                this.grabbedItem.x = this.clawX;
                this.grabbedItem.y = this.clawY + 32;
            }

            if (this.clawY <= this.restingY) {
                this.clawY = this.restingY;
                this.state = 'RETURNING';
            }
        }

        // Regreso al ducto de entrega (lado izquierdo, pasando el acrílico)
        if (this.state === 'RETURNING') {
            const dropX = 48; // Centro de la rampa izquierda
            if (this.clawX > dropX) {
                this.clawX -= 2.8;
                if (this.grabbedItem) {
                    this.grabbedItem.x = this.clawX;
                    this.grabbedItem.y = this.clawY + 32;
                }
            } else {
                this.clawX = dropX;
                this.state = 'RELEASING';
                this.clawTargetAngle = 38; // Abrir garra

                if (this.grabbedItem) {
                    this.wonItem = this.grabbedItem;
                    this.grabbedItem = null;
                    this.onWinPrize(this.wonItem);
                } else {
                    this.onMissed();
                }
            }
        }

        // Interpolación de apertura de tenazas
        this.clawAngle += (this.clawTargetAngle - this.clawAngle) * 0.16;

        // Actualizar confeti
        this.updateConfetti();
    }

    detectPlushieGrab() {
        let nearest = null;
        let minDist = 38;

        this.plushieMountain.forEach(item => {
            if (item.isTopTarget) {
                const dist = Math.abs(this.clawX - item.x);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = item;
                }
            }
        });

        if (nearest) {
            this.grabbedItem = nearest;
            nearest.grabbed = true;
        } else {
            this.grabbedItem = null;
        }
    }

    onWinPrize(prize) {
        if (window.soundFX) window.soundFX.playWin();

        // Generar confeti en la rampa
        for (let i = 0; i < 45; i++) {
            this.confetti.push({
                x: 48 + (Math.random() * 20 - 10),
                y: this.height - 40,
                vx: (Math.random() - 0.5) * 6,
                vy: -(Math.random() * 8 + 4),
                size: Math.random() * 6 + 4,
                color: ['#00e5ff', '#ff1744', '#ffd600', '#69f0ae', '#ffffff'][Math.floor(Math.random() * 5)],
                alpha: 1
            });
        }

        setTimeout(() => {
            this.state = this.credits > 0 ? 'READY' : 'WAITING_COIN';
            this.generatePlushieMountain();
        }, 1200);
    }

    onMissed() {
        if (window.soundFX) window.soundFX.playMiss();
        setTimeout(() => {
            this.state = this.credits > 0 ? 'READY' : 'WAITING_COIN';
        }, 800);
    }

    updateConfetti() {
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            const p = this.confetti[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.22;
            p.alpha -= 0.015;
            if (p.alpha <= 0) this.confetti.splice(i, 1);
        }
    }

    // ========================================================
    // RENDERIZADO DEL ESCENARIO 3D Y LA GARRA
    // ========================================================
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Fondo de la cámara 3D (Paredes interiores y techo rosa)
        this.drawChamber3D(ctx);

        // 2. Rampa de Caída (Ducto de entrega a la izquierda)
        this.drawDropChute(ctx);

        // 3. Montaña Volumétrica de Peluches / Premios
        this.drawPlushieMountain(ctx);

        // 4. Separador Acrílico Transparente (Como en la foto)
        this.drawAcrylicPartition(ctx);

        // 5. La Garra Mecánica con Domo Rosa Neón
        this.drawClaw(ctx);

        // 6. Confeti
        this.drawConfetti(ctx);
    }

    drawChamber3D(ctx) {
        // Fondo degradado profundo en magenta/rosa
        const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        bgGrad.addColorStop(0, '#2e0824');
        bgGrad.addColorStop(0.5, '#1b0515');
        bgGrad.addColorStop(1, '#0e020c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Riel Superior Metálico en el Techo
        ctx.fillStyle = '#424242';
        ctx.fillRect(0, 16, this.width, 10);
        ctx.fillStyle = '#9e9e9e';
        ctx.fillRect(0, 20, this.width, 2);

        // Suelo de la vitrina
        ctx.fillStyle = '#1a0414';
        ctx.fillRect(0, this.floorY, this.width, this.height - this.floorY);
    }

    drawDropChute(ctx) {
        // La caja receptora blanca/acrílica a la izquierda
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(10, this.floorY - 60, this.acrylicX - 10, 60);

        // Interior oscuro del ducto de caída
        ctx.fillStyle = '#212121';
        ctx.fillRect(18, this.floorY - 50, this.acrylicX - 26, 50);

        // Bisel de la rampa
        ctx.strokeStyle = '#bdbdbd';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, this.floorY - 60, this.acrylicX - 10, 60);
    }

    drawPlushieMountain(ctx) {
        // Ordenar por capas para dar sensación de volumen
        this.plushieMountain.forEach(item => {
            if (item.grabbed && this.state !== 'LIFTING' && this.state !== 'RETURNING') return;

            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rot);

            // Sombra inferior
            ctx.beginPath();
            ctx.ellipse(0, item.radius * 0.7, item.radius * 0.9, item.radius * 0.35, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fill();

            // Cuerpo del Peluche (Esfera 3D con degradado radial brillante)
            const radGrad = ctx.createRadialGradient(
                -item.radius * 0.3, -item.radius * 0.3, item.radius * 0.1,
                0, 0, item.radius
            );
            radGrad.addColorStop(0, '#ffffff');
            radGrad.addColorStop(0.3, item.color);
            radGrad.addColorStop(1, this.shadeColor(item.color, -30));

            ctx.beginPath();
            ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
            ctx.fillStyle = radGrad;
            ctx.fill();

            // Borde suave
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Icono / Expresión del peluche
            ctx.font = `${Math.round(item.radius * 1.1)}px "Segoe UI Emoji", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.eye, 0, 1);

            ctx.restore();
        });
    }

    drawAcrylicPartition(ctx) {
        // Separador acrílico vertical transparente entre el ducto y los peluches
        const x = this.acrylicX;
        const topY = this.floorY - 95;
        const height = 95;

        // Vidrio acrílico semitransparente
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(x - 3, topY, 6, height);

        // Borde brillante superior y frontal del acrílico
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, this.floorY);
        ctx.stroke();

        // Destello blanco en la esquina superior del acrílico
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, topY, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawClaw(ctx) {
        // 1. Carro superior en el riel
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(this.clawX - 18, 12, 36, 14);
        ctx.fillStyle = '#ff4081';
        ctx.fillRect(this.clawX - 6, 22, 12, 4);

        // 2. Cable metálico extensible
        ctx.strokeStyle = '#eeeeee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.clawX, 26);
        ctx.lineTo(this.clawX, this.clawY);
        ctx.stroke();

        // 3. Mecanismo de la Garra (Domo Rosa Iluminado - Como en la foto)
        ctx.save();
        ctx.translate(this.clawX, this.clawY);

        // Domo Rosa Brillante (Cúpula hemisférica superior)
        const domeGrad = ctx.createRadialGradient(0, -6, 2, 0, -2, 14);
        domeGrad.addColorStop(0, '#ffffff');
        domeGrad.addColorStop(0.4, '#ff4081');
        domeGrad.addColorStop(1, '#c2185b');

        ctx.beginPath();
        ctx.arc(0, 0, 14, Math.PI, 0); // Semicírculo
        ctx.fillStyle = domeGrad;
        ctx.fill();

        // Brillo LED del domo
        ctx.shadowColor = '#ff4081';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Base metálica de las tenazas
        ctx.fillStyle = '#9e9e9e';
        ctx.fillRect(-10, 0, 20, 6);

        // 4. Tenazas Metálicas Curvas (Izquierda, Centro y Derecha)
        const rad = (this.clawAngle * Math.PI) / 180;

        // Tenaza Izquierda
        ctx.save();
        ctx.translate(-7, 6);
        ctx.rotate(-rad);
        this.drawMetallicProng(ctx, -1);
        ctx.restore();

        // Tenaza Derecha
        ctx.save();
        ctx.translate(7, 6);
        ctx.rotate(rad);
        this.drawMetallicProng(ctx, 1);
        ctx.restore();

        ctx.restore();
    }

    drawMetallicProng(ctx, dir) {
        // Brazo de la tenaza (blanco/plata metálico como la foto)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(dir * 15, 20);
        ctx.stroke();

        // Curva de sujeción inferior
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(dir * 15, 20);
        ctx.quadraticCurveTo(dir * 18, 32, dir * 5, 36);
        ctx.stroke();

        // Puntera de goma rosa
        ctx.fillStyle = '#ff4081';
        ctx.beginPath();
        ctx.arc(dir * 5, 36, 3.5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawConfetti(ctx) {
        this.confetti.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });
    }

    shadeColor(color, percent) {
        let num = parseInt(color.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Iniciar al cargar
window.addEventListener('DOMContentLoaded', () => {
    window.clawGame = new VirtualClawcadeGame();
});
