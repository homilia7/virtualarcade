/**
 * game.js - Motor 3D Real para "Virtual Clawcade" basado en Three.js / WebGL.
 * Entorno 3D con perspectiva, iluminación PBR, sombras dinámicas, rieles en X y Z,
 * garra articulada y montaña volumétrica de peluches tridimensionales.
 */

// Paleta de peluches para la montaña 3D
const PLUSHIE_COLORS = [
    { name: 'Peluchetón Rosa', color: 0xff80ab, earColor: 0xff4081, emoji: '🐰' },
    { name: 'Osito Menta', color: 0x69f0ae, earColor: 0x00e676, emoji: '🐻' },
    { name: 'Gatito Dorado', color: 0xffd54f, earColor: 0xffb300, emoji: '🐱' },
    { name: 'Conejito Pastel', color: 0xea80fc, earColor: 0xaa00ff, emoji: '🐰' },
    { name: 'Pollito Solar', color: 0xffee58, earColor: 0xfdd835, emoji: '🐥' },
    { name: 'Pulpo Turquesa', color: 0x40c4ff, earColor: 0x00b0ff, emoji: '🐙' },
    { name: 'Panda Suave', color: 0xf5f5f5, earColor: 0x212121, emoji: '🐼' },
    { name: 'Dino Pastel', color: 0xb9f6ca, earColor: 0x69f0ae, emoji: '🦖' },
    { name: 'Zorrito Coral', color: 0xffab91, earColor: 0xff7043, emoji: '🦊' }
];

class Real3DClawcade {
    constructor() {
        this.container = document.querySelector('.glass-chamber');
        this.canvas = document.getElementById('gameCanvas');

        // Estado del juego
        this.state = 'WAITING_COIN';
        this.credits = 1;
        this.currentTheme = 'plushies';

        // Coordenadas de la Garra en el espacio 3D
        // Límites del gabinete: X [-2.2, 5.0], Z [-3.5, 3.5], Y [4.2 arriba, -2.8 abajo]
        this.clawPos = { x: 1.5, y: 4.0, z: 0.0 };
        this.restingY = 4.0;
        this.chutePos = { x: -4.2, y: 4.0, z: 1.8 }; // Posición de la rampa a la izquierda
        this.clawAngle = 0.6; // Radianes de apertura de tenazas
        this.targetClawAngle = 0.6;

        // Entradas de movimiento (Ejes X y Z)
        this.moveX = 0; // -1 izquierda, +1 derecha
        this.moveZ = 0; // -1 fondo, +1 adelante

        // Compatibilidad con controladores existentes
        this.moveLeft = false;
        this.moveRight = false;

        // Lista de peluches 3D
        this.plushies = [];
        this.grabbedPlushie = null;

        // Inicializar Three.js
        this.initThree();
        this.buildCabinet3D();
        this.buildCraneAndClaw3D();
        this.spawnPlushieMountain3D();
        this.bindEvents();

        // Actualizar créditos en UI
        this.updateCreditsDisplay();

        // Bucle de animación 60 FPS
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initThree() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // 1. Escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a0515);

        // 2. Cámara en perspectiva
        this.camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
        this.camera.position.set(0, 0.8, 12.2);
        this.camera.lookAt(0, -0.4, 0);

        // 3. Renderizador WebGL con sombras suaves
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 4. Luces en tiempo real
        // Luz ambiente cálida
        const ambient = new THREE.AmbientLight(0xffffff, 0.75);
        this.scene.add(ambient);

        // Foco cenital principal con proyección de sombras
        this.spotLight = new THREE.SpotLight(0xfff5f8, 1.8);
        this.spotLight.position.set(0, 9, 2);
        this.spotLight.angle = Math.PI / 3;
        this.spotLight.penumbra = 0.4;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.camera.near = 1;
        this.spotLight.shadow.camera.far = 15;
        this.scene.add(this.spotLight);

        // Luz Neón Cian (Pilar Izquierdo)
        const cyanLight = new THREE.PointLight(0x00e5ff, 1.2, 16);
        cyanLight.position.set(-6, 2, 2);
        this.scene.add(cyanLight);

        // Luz Neón Magenta (Pilar Derecho)
        const pinkLight = new THREE.PointLight(0xff1493, 1.2, 16);
        pinkLight.position.set(6, 2, 2);
        this.scene.add(pinkLight);

        // Redimensionamiento
        window.addEventListener('resize', () => {
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    buildCabinet3D() {
        // Material de paredes interiores rosa magenta (como la foto)
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x880e4f,
            roughness: 0.5,
            metalness: 0.1
        });

        // Suelo interior
        const floorGeo = new THREE.PlaneGeometry(13, 10);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x2d0720,
            roughness: 0.3,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -4.8;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Pared trasera
        const backGeo = new THREE.PlaneGeometry(13, 11);
        const backWall = new THREE.Mesh(backGeo, wallMat);
        backWall.position.set(0, 0.5, -4.9);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Pared izquierda
        const sideGeo = new THREE.PlaneGeometry(10, 11);
        const leftWall = new THREE.Mesh(sideGeo, wallMat);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-6.4, 0.5, 0);
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Pared derecha
        const rightWall = new THREE.Mesh(sideGeo, wallMat);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.set(6.4, 0.5, 0);
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);

        // ----------------------------------------------------
        // RAMPA DE PREMIOS (DUCTO) Y SEPARADOR ACRÍLICO 3D
        // ----------------------------------------------------
        // Caja de caída en la esquina frontal-izquierda
        const chuteBoxGeo = new THREE.BoxGeometry(2.6, 2.5, 3.2);
        const chuteBoxMat = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.2,
            metalness: 0.1
        });
        const chuteBox = new THREE.Mesh(chuteBoxGeo, chuteBoxMat);
        chuteBox.position.set(-4.5, -3.6, 1.8);
        chuteBox.receiveShadow = true;
        this.scene.add(chuteBox);

        // Hueco interior oscuro de la rampa
        const chuteHoleGeo = new THREE.BoxGeometry(2.1, 0.2, 2.7);
        const chuteHoleMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
        const chuteHole = new THREE.Mesh(chuteHoleGeo, chuteHoleMat);
        chuteHole.position.set(-4.5, -2.3, 1.8);
        this.scene.add(chuteHole);

        // Separador Acrílico Transparente (Como en la foto)
        const acrylicGeo = new THREE.BoxGeometry(0.12, 3.6, 6.5);
        const acrylicMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.38,
            roughness: 0.08,
            transmission: 0.9,
            thickness: 0.4
        });
        const acrylic = new THREE.Mesh(acrylicGeo, acrylicMat);
        acrylic.position.set(-3.1, -3.0, 1.2);
        this.scene.add(acrylic);
    }

    buildCraneAndClaw3D() {
        // Material cromado metálico para los rieles
        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xe0e0e0,
            metalness: 0.95,
            roughness: 0.12
        });

        // 1. Rieles Longitudinales (Eje Z en el techo)
        const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 9.8, 16);
        const railLeft = new THREE.Mesh(railGeo, chromeMat);
        railLeft.rotation.x = Math.PI / 2;
        railLeft.position.set(-5.5, 4.8, 0);
        this.scene.add(railLeft);

        const railRight = new THREE.Mesh(railGeo, chromeMat);
        railRight.rotation.x = Math.PI / 2;
        railRight.position.set(5.5, 4.8, 0);
        this.scene.add(railRight);

        // 2. Viga Transversal (Eje X que se desplaza en Z)
        this.crossbeam = new THREE.Group();
        const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 11.2, 16);
        const beamMesh = new THREE.Mesh(beamGeo, chromeMat);
        beamMesh.rotation.z = Math.PI / 2;
        this.crossbeam.add(beamMesh);
        this.scene.add(this.crossbeam);

        // 3. Carro de Transporte (Trolley que se desplaza en X)
        this.trolley = new THREE.Group();
        const trolleyBoxGeo = new THREE.BoxGeometry(1.2, 0.4, 1.0);
        const trolleyMat = new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.6 });
        const trolleyMesh = new THREE.Mesh(trolleyBoxGeo, trolleyMat);
        this.trolley.add(trolleyMesh);
        this.crossbeam.add(this.trolley);

        // 4. Cable Metálico Extensible (Y)
        const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
        this.cableMesh = new THREE.Mesh(cableGeo, chromeMat);
        this.cableMesh.position.y = -0.5;
        this.trolley.add(this.cableMesh);

        // 5. CABEZA DE LA GARRA Y DOMO ROSA BRILLANTE (IDÉNTICO A LA FOTO)
        this.clawHead = new THREE.Group();
        this.clawHead.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);
        this.scene.add(this.clawHead);

        // Cúpula Hemisférica Rosa Neón
        const domeGeo = new THREE.SphereGeometry(0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshStandardMaterial({
            color: 0xff4081,
            emissive: 0xc2185b,
            emissiveIntensity: 0.45,
            roughness: 0.25,
            metalness: 0.2
        });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = 0.1;
        this.clawHead.add(dome);

        // Anillo metálico base
        const ringGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.15, 32);
        const ring = new THREE.Mesh(ringGeo, chromeMat);
        ring.position.y = 0.05;
        this.clawHead.add(ring);

        // 6. Tres Tenazas Mecánicas Articuladas (120° entre sí)
        this.prongs = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const prongGroup = new THREE.Group();
            prongGroup.rotation.y = angle;

            // Pivote superior de rotación de la tenaza
            const pivot = new THREE.Group();
            pivot.position.set(0.55, 0, 0);

            // Brazo superior de la tenaza
            const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12);
            const arm = new THREE.Mesh(armGeo, chromeMat);
            arm.position.set(0.3, -0.55, 0);
            arm.rotation.z = -0.55;
            arm.castShadow = true;
            pivot.add(arm);

            // Punta curva de sujeción (blanco con punta de goma rosa)
            const tipGeo = new THREE.CylinderGeometry(0.065, 0.04, 0.8, 12);
            const tip = new THREE.Mesh(tipGeo, chromeMat);
            tip.position.set(0.75, -1.2, 0);
            tip.rotation.z = 0.8;
            tip.castShadow = true;
            pivot.add(tip);

            // Puntera de goma antideslizante rosa
            const rubberGeo = new THREE.SphereGeometry(0.09, 12, 12);
            const rubberMat = new THREE.MeshStandardMaterial({ color: 0xff4081, roughness: 0.8 });
            const rubber = new THREE.Mesh(rubberGeo, rubberMat);
            rubber.position.set(0.55, -1.5, 0);
            pivot.add(rubber);

            prongGroup.add(pivot);
            this.clawHead.add(prongGroup);
            this.prongs.push(pivot);
        }
    }

    /**
     * Genera la montaña volumétrica de 60+ peluches 3D apilados físicamente
     * con sombras y profundidad real.
     */
    spawnPlushieMountain3D() {
        // Limpiar peluches previos
        this.plushies.forEach(p => this.scene.remove(p.mesh));
        this.plushies = [];

        const startX = -2.4;
        const endX = 5.2;
        const startZ = -3.8;
        const endZ = 3.8;

        // Distribución en 3 niveles de altura (Capas volumétricas)
        for (let x = startX; x <= endX; x += 0.85) {
            for (let z = startZ; z <= endZ; z += 0.85) {
                const proto = PLUSHIE_COLORS[Math.floor(Math.random() * PLUSHIE_COLORS.length)];
                const radius = 0.52 + Math.random() * 0.12;

                // Forma de colina: más alto hacia el centro y fondo
                const distCenter = Math.sqrt(Math.pow(x - 1.5, 2) + Math.pow(z, 2));
                const heightOffset = Math.max(0, 1.8 - distCenter * 0.35);
                const posY = -4.5 + radius + heightOffset + (Math.random() * 0.3);

                const plushieGeo = new THREE.SphereGeometry(radius, 24, 24);
                const plushieMat = new THREE.MeshStandardMaterial({
                    color: proto.color,
                    roughness: 0.55,
                    metalness: 0.05
                });

                const mesh = new THREE.Mesh(plushieGeo, plushieMat);
                mesh.position.set(
                    x + (Math.random() * 0.25 - 0.12),
                    posY,
                    z + (Math.random() * 0.25 - 0.12)
                );
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Orejitas 3D
                const earGeo = new THREE.SphereGeometry(radius * 0.35, 12, 12);
                const earMat = new THREE.MeshStandardMaterial({ color: proto.earColor, roughness: 0.6 });
                const ear1 = new THREE.Mesh(earGeo, earMat);
                ear1.position.set(-radius * 0.7, radius * 0.7, 0);
                mesh.add(ear1);

                const ear2 = new THREE.Mesh(earGeo, earMat);
                ear2.position.set(radius * 0.7, radius * 0.7, 0);
                mesh.add(ear2);

                this.scene.add(mesh);
                this.plushies.push({
                    mesh,
                    name: proto.name,
                    radius,
                    initialY: posY,
                    isTop: posY > -3.2 // Peluches de la cima que la garra puede agarrar
                });
            }
        }
    }

    bindEvents() {
        // Monedas / Fichas
        const coinSlot = document.getElementById('billCoinSlot');
        if (coinSlot) coinSlot.addEventListener('click', () => this.insertCoin());

        // Botón ATRAPAR (Domo Rojo)
        const btnCatch = document.getElementById('btnCatch3D');
        if (btnCatch) {
            btnCatch.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.triggerGrab();
            });
        }

        // Joystick 3D con Soporte en Ambos Ejes (X y Z)
        const joystickBall = document.getElementById('joystickBall');
        const joystickStation = document.getElementById('joystickStation');
        let isDragging = false;
        let startX = 0, startY = 0;

        if (joystickStation) {
            joystickStation.addEventListener('pointerdown', (e) => {
                if (this.state !== 'READY') return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
            });

            window.addEventListener('pointermove', (e) => {
                if (!isDragging || this.state !== 'READY') return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // Eje X: Izquierda / Derecha
                if (dx < -12) this.moveX = -1;
                else if (dx > 12) this.moveX = 1;
                else this.moveX = 0;

                // Eje Z: Arriba (Fondo) / Abajo (Adelante)
                if (dy < -12) this.moveZ = -1;
                else if (dy > 12) this.moveZ = 1;
                else this.moveZ = 0;

                this.tiltJoystickVisual(this.moveX, this.moveZ);
            });

            const stopDrag = () => {
                if (!isDragging) return;
                isDragging = false;
                this.moveX = 0;
                this.moveZ = 0;
                this.tiltJoystickVisual(0, 0);
            };

            window.addEventListener('pointerup', stopDrag);
            window.addEventListener('pointercancel', stopDrag);
        }

        // Teclado con Flechas (↑, ↓, ←, →) y WASD para movimiento tridimensional completo
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.moveX = -1;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.moveX = 1;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.moveZ = -1; // Hacia el fondo
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.moveZ = 1;  // Hacia adelante

            this.tiltJoystickVisual(this.moveX, this.moveZ);

            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.triggerGrab();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') if (this.moveX < 0) this.moveX = 0;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') if (this.moveX > 0) this.moveX = 0;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') if (this.moveZ < 0) this.moveZ = 0;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') if (this.moveZ > 0) this.moveZ = 0;

            this.tiltJoystickVisual(this.moveX, this.moveZ);
        });

        // Alternar Temas
        const btnThemePlushies = document.getElementById('btnThemePlushies');
        const btnThemeGourmet = document.getElementById('btnThemeGourmet');
        if (btnThemePlushies && btnThemeGourmet) {
            btnThemePlushies.addEventListener('click', () => {
                this.currentTheme = 'plushies';
                btnThemePlushies.classList.add('active');
                btnThemeGourmet.classList.remove('active');
                this.spawnPlushieMountain3D();
            });
            btnThemeGourmet.addEventListener('click', () => {
                this.currentTheme = 'gourmet';
                btnThemeGourmet.classList.add('active');
                btnThemePlushies.classList.remove('active');
                this.spawnPlushieMountain3D();
            });
        }

        // Modo TV Kiosco
        const btnToggleKiosk = document.getElementById('btnToggleKiosk');
        if (btnToggleKiosk) {
            btnToggleKiosk.addEventListener('click', () => {
                document.body.classList.toggle('tv-kiosk-mode');
                setTimeout(() => {
                    const w = this.container.clientWidth;
                    const h = this.container.clientHeight;
                    this.camera.aspect = w / h;
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize(w, h);
                }, 100);
            });
        }
    }

    tiltJoystickVisual(x, z) {
        const ball = document.getElementById('joystickBall');
        if (!ball) return;
        const rotZ = x * 22;
        const rotX = -z * 22;
        ball.style.transform = `rotate(${rotZ}deg) translateY(${z * 8}px) translateX(${x * 10}px)`;
    }

    tiltJoystick(dir) {
        this.tiltJoystickVisual(dir, 0);
    }

    insertCoin() {
        if (window.soundFX) window.soundFX.playCoin();
        this.credits++;
        this.updateCreditsDisplay();
        if (this.state === 'WAITING_COIN') {
            this.state = 'READY';
            this.targetClawAngle = 0.6; // Abrir garra
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
        const speed = 0.08;

        // 1. Movimiento en X y Z (Hacia el fondo y los lados)
        if (this.state === 'READY') {
            // Sincronizar con controladores externos (gamepad.js / mobile)
            const finalX = this.moveX || (this.moveLeft ? -1 : (this.moveRight ? 1 : 0));
            const finalZ = this.moveZ;

            if (finalX !== 0) {
                this.clawPos.x = Math.max(-2.2, Math.min(5.0, this.clawPos.x + finalX * speed));
                if (window.soundFX && Math.random() < 0.15) window.soundFX.playMotor();
            }
            if (finalZ !== 0) {
                this.clawPos.z = Math.max(-3.5, Math.min(3.5, this.clawPos.z + finalZ * speed));
                if (window.soundFX && Math.random() < 0.15) window.soundFX.playMotor();
            }
        }

        // 2. Descenso en Y (Bajada de la garra)
        if (this.state === 'DROPPING') {
            this.clawPos.y -= 0.12;

            // Detección de contacto con la montaña en la posición (X, Z) actual
            if (this.clawPos.y <= -2.4) {
                this.clawPos.y = -2.4;
                this.state = 'GRABBING';
                this.targetClawAngle = 0.12; // Cierra las tenazas
                if (window.soundFX) window.soundFX.playClawGrab();

                this.detectPlushieCollision3D();
            }
        }

        // 3. Sujeción de tenazas
        if (this.state === 'GRABBING') {
            if (Math.abs(this.clawAngle - this.targetClawAngle) < 0.05) {
                this.state = 'LIFTING';
            }
        }

        // 4. Elevación de la garra (LIFTING)
        if (this.state === 'LIFTING') {
            this.clawPos.y += 0.09;

            if (this.grabbedPlushie) {
                this.grabbedPlushie.mesh.position.set(
                    this.clawPos.x,
                    this.clawPos.y - 1.2,
                    this.clawPos.z
                );
            }

            if (this.clawPos.y >= this.restingY) {
                this.clawPos.y = this.restingY;
                this.state = 'RETURNING';
            }
        }

        // 5. Traslado automático a la rampa de premios (Frontal Izquierda)
        if (this.state === 'RETURNING') {
            const dx = this.chutePos.x - this.clawPos.x;
            const dz = this.chutePos.z - this.clawPos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.1) {
                this.clawPos.x += (dx / dist) * 0.07;
                this.clawPos.z += (dz / dist) * 0.07;

                if (this.grabbedPlushie) {
                    this.grabbedPlushie.mesh.position.set(
                        this.clawPos.x,
                        this.clawPos.y - 1.2,
                        this.clawPos.z
                    );
                }
            } else {
                this.clawPos.x = this.chutePos.x;
                this.clawPos.z = this.chutePos.z;
                this.state = 'RELEASING';
                this.targetClawAngle = 0.65; // Abrir garra y soltar

                if (this.grabbedPlushie) {
                    this.onWinPrize3D(this.grabbedPlushie);
                    this.grabbedPlushie = null;
                } else {
                    this.onMissed3D();
                }
            }
        }

        // Suavizado del ángulo de tenazas
        this.clawAngle += (this.targetClawAngle - this.clawAngle) * 0.18;
        this.prongs.forEach(p => {
            p.rotation.z = -this.clawAngle;
        });

        // ----------------------------------------------------
        // ACTUALIZAR MODELOS 3D EN LA ESCENA
        // ----------------------------------------------------
        // Mover viga transversal en Z
        this.crossbeam.position.z = this.clawPos.z;
        // Mover carro en X
        this.trolley.position.x = this.clawPos.x;
        // Mover cabeza de garra
        this.clawHead.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);

        // Longitud del cable en 3D
        const cableLength = Math.max(0.1, 4.8 - this.clawPos.y);
        this.cableMesh.scale.y = cableLength;
        this.cableMesh.position.y = -cableLength / 2;

        // Foco de luz siguiendo la garra sutilmente
        this.spotLight.target = this.clawHead;

        // Parallax sutil de la cámara 3D para dar sensación de profundidad física
        this.camera.position.x = (this.clawPos.x * 0.15);
        this.camera.position.y = 0.8 + (this.clawPos.z * 0.1);
        this.camera.lookAt(0, -0.6, 0);
    }

    detectPlushieCollision3D() {
        let closest = null;
        let minDist = 1.35; // Radio de agarre 3D

        this.plushies.forEach(p => {
            if (p.isTop) {
                const dx = this.clawPos.x - p.mesh.position.x;
                const dz = this.clawPos.z - p.mesh.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < minDist) {
                    minDist = dist;
                    closest = p;
                }
            }
        });

        if (closest) {
            this.grabbedPlushie = closest;
        } else {
            this.grabbedPlushie = null;
        }
    }

    onWinPrize3D(prize) {
        if (window.soundFX) window.soundFX.playWin();

        // Caída física hacia el interior de la rampa
        const mesh = prize.mesh;
        let dropStep = 0;
        const dropInterval = setInterval(() => {
            dropStep += 0.15;
            mesh.position.y -= dropStep;
            if (mesh.position.y <= -5.5) {
                clearInterval(dropInterval);
                this.scene.remove(mesh);
            }
        }, 30);

        setTimeout(() => {
            this.state = this.credits > 0 ? 'READY' : 'WAITING_COIN';
            this.spawnPlushieMountain3D(); // Reponer montaña
        }, 1500);
    }

    onMissed3D() {
        if (window.soundFX) window.soundFX.playMiss();
        setTimeout(() => {
            this.state = this.credits > 0 ? 'READY' : 'WAITING_COIN';
        }, 1000);
    }

    animate() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }
}

// Iniciar al cargar
window.addEventListener('DOMContentLoaded', () => {
    window.clawGame = new Real3DClawcade();
});
