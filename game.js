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

// ========================================================
// GENERADORES 3D PROCEDURALES DE COMIDA GOURMET REALISTA
// ========================================================

/** 1. 🍔 Hamburguesa Doble Gourmet con Semillas de Sésamo y Queso Fundido */
function createBurgerMesh() {
    const burger = new THREE.Group();

    // Materiales PBR
    const bunMat = new THREE.MeshStandardMaterial({ color: 0xc87b32, roughness: 0.65, metalness: 0.05 });
    const pattyMat = new THREE.MeshStandardMaterial({ color: 0x3d1d0e, roughness: 0.9, metalness: 0.1 });
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffa000, roughness: 0.35, metalness: 0.05 });
    const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.25, metalness: 0.1 });
    const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.6 });
    const sesameMat = new THREE.MeshStandardMaterial({ color: 0xfffae0, roughness: 0.5 });

    // Pan inferior
    const bunBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.18, 24), bunMat);
    bunBottom.position.y = -0.35;
    bunBottom.castShadow = true;
    burger.add(bunBottom);

    // Carne a la parrilla
    const patty = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.22, 24), pattyMat);
    patty.position.y = -0.16;
    patty.castShadow = true;
    burger.add(patty);

    // Queso derretido (esquinas sobresalen)
    const cheese = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.85), cheeseMat);
    cheese.position.y = -0.03;
    cheese.rotation.y = Math.PI / 4;
    cheese.castShadow = true;
    burger.add(cheese);

    // Rodajas de tomate
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16), tomatoMat);
    t1.position.set(-0.2, 0.04, -0.1);
    burger.add(t1);
    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16), tomatoMat);
    t2.position.set(0.18, 0.04, 0.15);
    burger.add(t2);

    // Hojas de lechuga crujiente
    for (let i = 0; i < 5; i++) {
        const leafAngle = (i * Math.PI * 2) / 5;
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.4), lettuceMat);
        leaf.position.set(Math.cos(leafAngle) * 0.48, 0.08, Math.sin(leafAngle) * 0.48);
        leaf.rotation.y = leafAngle;
        leaf.rotation.x = 0.15;
        burger.add(leaf);
    }

    // Pan superior abombado
    const bunTop = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), bunMat);
    bunTop.scale.set(1.0, 0.58, 1.0);
    bunTop.position.y = 0.1;
    bunTop.castShadow = true;
    burger.add(bunTop);

    // Semillas de sésamo individuales en el pan
    const sesameGeo = new THREE.SphereGeometry(0.024, 6, 6);
    sesameGeo.scale(1.4, 0.5, 0.9);
    const seedCoords = [
        [0, 0.4, 0], [0.18, 0.38, 0.12], [-0.15, 0.37, 0.15],
        [0.25, 0.34, -0.1], [-0.22, 0.35, -0.12], [0.05, 0.36, -0.25],
        [-0.05, 0.37, 0.26], [0.32, 0.28, 0.18], [-0.3, 0.29, 0.1]
    ];
    seedCoords.forEach(pos => {
        const seed = new THREE.Mesh(sesameGeo, sesameMat);
        seed.position.set(pos[0], pos[1], pos[2]);
        seed.rotation.set(Math.random(), Math.random(), Math.random());
        burger.add(seed);
    });

    burger.scale.set(1.1, 1.1, 1.1);
    return burger;
}

/** 2. 🍟 Papas Fritas Crujientes en Caja Roja de Fast Food */
function createFriesMesh() {
    const fries = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.4, metalness: 0.05 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.3 });

    // Caja roja frontal
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.85, 0.45), boxMat);
    box.position.y = -0.15;
    box.castShadow = true;
    fries.add(box);

    // Franja decorativa dorada
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.47), stripeMat);
    stripe.position.y = -0.18;
    fries.add(stripe);

    // Bastones de papas fritas en abanico
    const fryMats = [
        new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.6 }),
        new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.6 }),
        new THREE.MeshStandardMaterial({ color: 0xf57f17, roughness: 0.65 })
    ];

    for (let i = 0; i < 16; i++) {
        const fLength = 0.65 + Math.random() * 0.35;
        const fry = new THREE.Mesh(new THREE.BoxGeometry(0.08, fLength, 0.08), fryMats[i % fryMats.length]);
        const offX = (Math.random() - 0.5) * 0.55;
        const offZ = (Math.random() - 0.5) * 0.28;
        fry.position.set(offX, 0.2 + fLength / 2 - 0.2, offZ);
        fry.rotation.set((Math.random() - 0.5) * 0.25, Math.random() * 0.5, (offX / 0.55) * 0.35);
        fry.castShadow = true;
        fries.add(fry);
    }

    fries.scale.set(1.15, 1.15, 1.15);
    return fries;
}

/** 3. 🌮 Taco al Pastor Mexicano con Tortilla Doblada, Piña y Cilantro */
function createTacoMesh() {
    const taco = new THREE.Group();
    const shellMat = new THREE.MeshStandardMaterial({ color: 0xf3bd76, roughness: 0.7, metalness: 0.05 });
    const meatMat = new THREE.MeshStandardMaterial({ color: 0x6d2312, roughness: 0.85 });

    // Tortilla de maíz doblada en U (dos caras inclinadas y base curva)
    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.75, 1.1), shellMat);
    wall1.position.set(-0.25, 0.05, 0);
    wall1.rotation.z = -0.32;
    wall1.castShadow = true;
    taco.add(wall1);

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.75, 1.1), shellMat);
    wall2.position.set(0.25, 0.05, 0);
    wall2.rotation.z = 0.32;
    wall2.castShadow = true;
    taco.add(wall2);

    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.1, 16, 1, false, 0, Math.PI), shellMat);
    bottom.rotation.x = Math.PI / 2;
    bottom.rotation.z = Math.PI;
    bottom.position.y = -0.22;
    taco.add(bottom);

    // Relleno de carne al pastor marinada
    const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.22, 1.0, 12), meatMat);
    meat.rotation.x = Math.PI / 2;
    meat.position.y = -0.05;
    meat.castShadow = true;
    taco.add(meat);

    // Piña asada en cubitos
    const pineappleMat = new THREE.MeshStandardMaterial({ color: 0xffd600, roughness: 0.3 });
    for (let i = 0; i < 4; i++) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.14), pineappleMat);
        p.position.set((Math.random() - 0.5) * 0.18, 0.22, -0.35 + i * 0.22);
        p.rotation.set(Math.random(), Math.random(), Math.random());
        taco.add(p);
    }

    // Cilantro picado fresco
    const cilantroMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });
    for (let i = 0; i < 12; i++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.06), cilantroMat);
        c.position.set((Math.random() - 0.5) * 0.22, 0.24, (Math.random() - 0.5) * 0.85);
        taco.add(c);
    }

    // Hebras de queso fundido
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffca28, roughness: 0.4 });
    for (let i = 0; i < 3; i++) {
        const ch = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.4), cheeseMat);
        ch.position.set((Math.random() - 0.5) * 0.15, 0.2, (Math.random() - 0.5) * 0.5);
        ch.rotation.y = (Math.random() - 0.5) * 0.6;
        taco.add(ch);
    }

    taco.scale.set(1.1, 1.1, 1.1);
    return taco;
}

/** 4. 🥟 Empanada Criolla Dorada con Repulgue Trenzado Artesanal */
function createEmpanadaMesh() {
    const empanada = new THREE.Group();
    const crustMat = new THREE.MeshStandardMaterial({ color: 0xdf994a, roughness: 0.45, metalness: 0.05 });
    const braidMat = new THREE.MeshStandardMaterial({ color: 0xbf782c, roughness: 0.5 });

    // Masa inflada en media luna
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.68, 20, 16, 0, Math.PI, 0, Math.PI), crustMat);
    body.scale.set(1.0, 0.42, 0.55);
    body.rotation.x = -Math.PI / 2;
    body.position.y = -0.05;
    body.castShadow = true;
    empanada.add(body);

    // Repulgue trenzado tradicional a lo largo del arco exterior
    const braidCount = 13;
    const radius = 0.68;
    for (let i = 0; i <= braidCount; i++) {
        const t = (i / braidCount) * Math.PI;
        const bx = Math.cos(t) * radius;
        const bz = Math.sin(t) * (radius * 0.55);
        const fold = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.045, 8, 12), braidMat);
        fold.position.set(bx, 0.02, bz);
        fold.rotation.x = Math.PI / 2;
        fold.rotation.z = -t + Math.PI / 4;
        fold.castShadow = true;
        empanada.add(fold);
    }

    // Barniz de huevo horneado (brillo satinado)
    const gloss = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 12, 10, 0, Math.PI, 0, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xffd180, roughness: 0.25, transparent: true, opacity: 0.35 })
    );
    gloss.scale.set(1.0, 0.44, 0.52);
    gloss.rotation.x = -Math.PI / 2;
    gloss.position.y = -0.04;
    empanada.add(gloss);

    empanada.scale.set(1.2, 1.2, 1.2);
    return empanada;
}

/** 5. 🍩 Dona Gourmet Glaseada de Fresa con Chispas de Colores */
function createDessertMesh() {
    const dessert = new THREE.Group();
    const doughMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.75, metalness: 0.02 });
    const glazeMat = new THREE.MeshStandardMaterial({ color: 0xff4081, roughness: 0.15, metalness: 0.1 });

    // Masa esponjosa dorada
    const dough = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.24, 20, 32), doughMat);
    dough.rotation.x = Math.PI / 2;
    dough.castShadow = true;
    dessert.add(dough);

    // Glaseado espejo de fresa
    const glaze = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.255, 16, 32, Math.PI * 2), glazeMat);
    glaze.rotation.x = Math.PI / 2;
    glaze.position.y = 0.05;
    glaze.scale.set(1.0, 1.0, 0.95);
    dessert.add(glaze);

    // Chispitas multicolores (Sprinkles)
    const sprinkleColors = [0xffffff, 0x00e5ff, 0xffee58, 0x76ff03, 0x7c4dff, 0xff9100];
    for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 0.38 + Math.random() * 0.28;
        const s = new THREE.Mesh(
            new THREE.CylinderGeometry(0.022, 0.022, 0.08, 8),
            new THREE.MeshStandardMaterial({ color: sprinkleColors[i % sprinkleColors.length], roughness: 0.3 })
        );
        s.position.set(Math.cos(angle) * rad, 0.28, Math.sin(angle) * rad);
        s.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
        dessert.add(s);
    }

    dessert.scale.set(1.15, 1.15, 1.15);
    return dessert;
}

// Catálogo de Premios Gourmet Realistas
const FOOD_PRIZES = [
    { type: 'burger', name: 'Hamburguesa Doble Gourmet', emoji: '🍔', create: createBurgerMesh },
    { type: 'fries', name: 'Papas Fritas Crujientes', emoji: '🍟', create: createFriesMesh },
    { type: 'taco', name: 'Taco al Pastor Supremo', emoji: '🌮', create: createTacoMesh },
    { type: 'empanada', name: 'Empanada Criolla Dorada', emoji: '🥟', create: createEmpanadaMesh },
    { type: 'dessert', name: 'Dona Glaseada de Fresa', emoji: '🍩', create: createDessertMesh }
];

class Real3DClawcade {
    constructor() {
        this.container = document.querySelector('.glass-chamber');
        this.canvas = document.getElementById('gameCanvas');

        // Estado del juego
        this.state = 'WAITING_COIN';
        this.credits = 1;
        this.currentTheme = 'gourmet'; // Comida gourmet por defecto

        // Coordenadas de la Garra en el espacio 3D
        // Límites del gabinete: X [-2.2, 5.0], Z [-3.5, 3.5], Y [3.3 arriba, -2.4 abajo]
        this.clawPos = { x: 1.5, y: 3.3, z: 0.0 };
        this.restingY = 3.3;
        this.chutePos = { x: -4.5, y: 3.3, z: 1.8 }; // Posición del depósito/tolva iluminada a la izquierda
        this.clawAngle = 0.15; // Reposo relajado (se abre al descender)
        this.targetClawAngle = 0.15;

        // Físicas de inercia y balanceo pendular del cable (Sway)
        this.swayX = 0;
        this.swayZ = 0;
        this.swayVelX = 0;
        this.swayVelZ = 0;
        this.prevClawX = this.clawPos.x;
        this.prevClawZ = this.clawPos.z;

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
        // RAMPA Y DEPÓSITO DE PREMIOS 3D DE ALTA VISIBILIDAD
        // ----------------------------------------------------
        const chuteGroup = new THREE.Group();
        chuteGroup.position.set(-4.5, -2.6, 1.8);

        // 1. Tolva principal exterior (Caja sólida visible con buen contraste)
        const chuteBodyGeo = new THREE.BoxGeometry(2.7, 3.2, 3.4);
        const chuteBodyMat = new THREE.MeshStandardMaterial({
            color: 0x1a2130,
            roughness: 0.35,
            metalness: 0.25
        });
        const chuteBody = new THREE.Mesh(chuteBodyGeo, chuteBodyMat);
        chuteBody.position.y = -0.6;
        chuteBody.receiveShadow = true;
        chuteGroup.add(chuteBody);

        // 2. Marco superior LED Neón Cian que delimita el brocal del agujero
        const rimGeo = new THREE.BoxGeometry(2.8, 0.16, 3.5);
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00b0ff,
            emissiveIntensity: 0.85,
            roughness: 0.2,
            metalness: 0.4
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.position.y = 1.05;
        chuteGroup.add(rim);

        // 3. Orificio/embudo interior profundo donde caen los productos
        const holeGeo = new THREE.BoxGeometry(2.3, 0.12, 2.9);
        const holeMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.y = 0.98;
        chuteGroup.add(hole);

        // 4. Luz LED interior cian que ilumina el túnel de caída
        const chuteLight = new THREE.PointLight(0x00e5ff, 1.8, 5.0);
        chuteLight.position.set(0, 0.4, 0);
        chuteGroup.add(chuteLight);

        // 5. Señalética / Rótulo frontal iluminado "PREMIOS"
        const signGeo = new THREE.BoxGeometry(1.9, 0.45, 0.08);
        const signMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.9,
            roughness: 0.2
        });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 0.65, 1.74);
        chuteGroup.add(sign);

        this.scene.add(chuteGroup);

        // 6. Separador Acrílico Transparente con Perfil Superior Iluminado
        const acrylicGeo = new THREE.BoxGeometry(0.12, 3.6, 6.5);
        const acrylicMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            roughness: 0.06,
            transmission: 0.95,
            thickness: 0.5
        });
        const acrylic = new THREE.Mesh(acrylicGeo, acrylicMat);
        acrylic.position.set(-3.1, -2.8, 1.2);
        this.scene.add(acrylic);

        // Barandilla superior de neón sobre el separador acrílico
        const railGeo = new THREE.CylinderGeometry(0.06, 0.06, 6.5, 16);
        const railMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00b0ff,
            emissiveIntensity: 0.7,
            roughness: 0.2,
            metalness: 0.8
        });
        const acrylicRail = new THREE.Mesh(railGeo, railMat);
        acrylicRail.rotation.x = Math.PI / 2;
        acrylicRail.position.set(-3.1, -0.95, 1.2);
        this.scene.add(acrylicRail);
    }

    buildCraneAndClaw3D() {
        // Materiales de Grado Industrial y PBR Realista
        const chromeMirrorMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.98,
            roughness: 0.05
        });

        const darkSteelMat = new THREE.MeshStandardMaterial({
            color: 0x263238,
            metalness: 0.88,
            roughness: 0.22
        });

        const brassBoltMat = new THREE.MeshStandardMaterial({
            color: 0xffd54f,
            metalness: 0.95,
            roughness: 0.15
        });

        const pinkGlowMat = new THREE.MeshStandardMaterial({
            color: 0xff4081,
            emissive: 0xc2185b,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.2
        });

        const rubberGripMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.92,
            metalness: 0.05
        });

        // 1. Rieles Longitudinales (Eje Z en el techo)
        const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 9.8, 16);
        const railLeft = new THREE.Mesh(railGeo, chromeMirrorMat);
        railLeft.rotation.x = Math.PI / 2;
        railLeft.position.set(-5.5, 4.8, 0);
        this.scene.add(railLeft);

        const railRight = new THREE.Mesh(railGeo, chromeMirrorMat);
        railRight.rotation.x = Math.PI / 2;
        railRight.position.set(5.5, 4.8, 0);
        this.scene.add(railRight);

        // 2. Viga Transversal (Eje X que se desplaza en Z en el techo a Y = 4.8)
        this.crossbeam = new THREE.Group();
        const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 11.2, 16);
        const beamMesh = new THREE.Mesh(beamGeo, chromeMirrorMat);
        beamMesh.rotation.z = Math.PI / 2;
        this.crossbeam.add(beamMesh);

        // Bloques y rodamientos guía en los extremos que corren sobre los rieles
        const guideGeo = new THREE.BoxGeometry(0.35, 0.25, 0.45);
        const guideLeft = new THREE.Mesh(guideGeo, darkSteelMat);
        guideLeft.position.set(-5.5, 0, 0);
        this.crossbeam.add(guideLeft);

        const guideRight = new THREE.Mesh(guideGeo, darkSteelMat);
        guideRight.position.set(5.5, 0, 0);
        this.crossbeam.add(guideRight);

        // Anclaje permanente de la viga en el riel superior del techo
        this.crossbeam.position.set(0, 4.8, this.clawPos.z);
        this.scene.add(this.crossbeam);

        // 3. Carro de Transporte (Trolley con polea y motor)
        this.trolley = new THREE.Group();
        const trolleyBoxGeo = new THREE.BoxGeometry(1.2, 0.35, 1.0);
        const trolleyMesh = new THREE.Mesh(trolleyBoxGeo, darkSteelMat);
        this.trolley.add(trolleyMesh);

        // Polea cromada en el carro
        const pulleyGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 24);
        const pulleyMesh = new THREE.Mesh(pulleyGeo, chromeMirrorMat);
        pulleyMesh.rotation.z = Math.PI / 2;
        pulleyMesh.position.set(0, -0.2, 0);
        this.trolley.add(pulleyMesh);
        this.crossbeam.add(this.trolley);

        // 4. Cable de Acero Trenzado Extensible (Y)
        const cableGeo = new THREE.CylinderGeometry(0.025, 0.025, 1, 12);
        this.cableMesh = new THREE.Mesh(cableGeo, chromeMirrorMat);
        this.cableMesh.position.y = -0.5;
        this.trolley.add(this.cableMesh);

        // 5. CABEZA DE LA GARRA METÁLICA REALISTA
        this.clawHead = new THREE.Group();
        this.clawHead.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);
        this.scene.add(this.clawHead);

        // Anilla giratoria superior de suspensión
        const swivelGeo = new THREE.TorusGeometry(0.18, 0.045, 12, 24);
        const swivelMesh = new THREE.Mesh(swivelGeo, chromeMirrorMat);
        swivelMesh.position.set(0, 0.95, 0);
        this.clawHead.add(swivelMesh);

        // Cúpula Hemisférica Rosa Neón Superior con anillo cromado
        const domeGeo = new THREE.SphereGeometry(0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, pinkGlowMat);
        dome.position.y = 0.25;
        this.clawHead.add(dome);

        // Corona / Bisel metálico del domo
        const domeBezelGeo = new THREE.TorusGeometry(0.66, 0.05, 12, 32);
        const domeBezel = new THREE.Mesh(domeBezelGeo, chromeMirrorMat);
        domeBezel.rotation.x = Math.PI / 2;
        domeBezel.position.y = 0.25;
        this.clawHead.add(domeBezel);

        // Carcasa Principal Cilindro de Acero Oscuro (Gearbox)
        const casingGeo = new THREE.CylinderGeometry(0.62, 0.68, 0.65, 32);
        const casing = new THREE.Mesh(casingGeo, darkSteelMat);
        casing.position.y = -0.1;
        this.clawHead.add(casing);

        // Anillo inferior cromado con reborde
        const baseRingGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 32);
        const baseRing = new THREE.Mesh(baseRingGeo, chromeMirrorMat);
        baseRing.position.y = -0.42;
        this.clawHead.add(baseRing);

        // Vástago Central Móvil (Pistón Neumático de Accionamiento)
        this.pistonShaft = new THREE.Group();
        const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.4, 16);
        const rod = new THREE.Mesh(rodGeo, chromeMirrorMat);
        this.pistonShaft.add(rod);

        // Collar inferior del pistón (Conector de bielas de tijera)
        const collarGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 24);
        const collar = new THREE.Mesh(collarGeo, darkSteelMat);
        collar.position.y = -0.65;
        this.pistonShaft.add(collar);
        this.clawHead.add(this.pistonShaft);

        // 6. Tres Tenazas Mecánicas Articuladas con Bielas de Tijera (120° entre sí)
        this.prongs = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const prongGroup = new THREE.Group();
            prongGroup.rotation.y = angle;

            // Horquilla de Montaje Superior en el cuerpo
            const bracketGeo = new THREE.BoxGeometry(0.15, 0.2, 0.25);
            const bracket = new THREE.Mesh(bracketGeo, darkSteelMat);
            bracket.position.set(0.68, -0.42, 0);
            prongGroup.add(bracket);

            // Perno dorado hexagonal del eje superior
            const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12);
            const pin = new THREE.Mesh(pinGeo, brassBoltMat);
            pin.rotation.x = Math.PI / 2;
            pin.position.set(0.68, -0.42, 0);
            prongGroup.add(pin);

            // PIVOTE DEL BRAZO SUPERIOR
            const upperPivot = new THREE.Group();
            upperPivot.position.set(0.68, -0.42, 0);

            // Brazo de Doble Placa de Acero Cromado
            const armPlateGeo = new THREE.BoxGeometry(0.12, 1.35, 0.16);
            const armPlate = new THREE.Mesh(armPlateGeo, chromeMirrorMat);
            armPlate.position.set(0.35, -0.62, 0);
            armPlate.rotation.z = -0.52;
            armPlate.castShadow = true;
            upperPivot.add(armPlate);

            // Biela de Articulación (Linkage rod conectada a la tijera)
            const linkGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.85, 12);
            const linkageRod = new THREE.Mesh(linkGeo, chromeMirrorMat);
            linkageRod.position.set(0.15, -0.4, 0);
            linkageRod.rotation.z = 0.65;
            upperPivot.add(linkageRod);

            // PIVOTE DE LA PINZA CURVA INFERIOR (Codo articulado)
            const lowerTalon = new THREE.Group();
            lowerTalon.position.set(0.72, -1.25, 0);

            // Perno de articulación del codo
            const elbowPin = new THREE.Mesh(pinGeo, brassBoltMat);
            elbowPin.rotation.x = Math.PI / 2;
            lowerTalon.add(elbowPin);

            // Hoja de la Garra Curva (Segmento 1)
            const talonSeg1Geo = new THREE.CylinderGeometry(0.09, 0.065, 0.8, 16);
            const talonSeg1 = new THREE.Mesh(talonSeg1Geo, chromeMirrorMat);
            talonSeg1.position.set(0.2, -0.35, 0);
            talonSeg1.rotation.z = 0.55;
            talonSeg1.castShadow = true;
            lowerTalon.add(talonSeg1);

            // Hoja de la Garra Curva (Segmento 2 hacia adentro)
            const talonSeg2Geo = new THREE.CylinderGeometry(0.065, 0.04, 0.7, 16);
            const talonSeg2 = new THREE.Mesh(talonSeg2Geo, chromeMirrorMat);
            talonSeg2.position.set(-0.05, -0.85, 0);
            talonSeg2.rotation.z = 1.25;
            talonSeg2.castShadow = true;
            lowerTalon.add(talonSeg2);

            // Puntera Cónica Afilada
            const tipConeGeo = new THREE.ConeGeometry(0.05, 0.28, 16);
            const tipCone = new THREE.Mesh(tipConeGeo, chromeMirrorMat);
            tipCone.position.set(-0.35, -1.02, 0);
            tipCone.rotation.z = 1.95;
            lowerTalon.add(tipCone);

            // Puntera de Goma Negra Antideslizante (Grip Pad)
            const gripGeo = new THREE.BoxGeometry(0.09, 0.22, 0.12);
            const grip = new THREE.Mesh(gripGeo, rubberGripMat);
            grip.position.set(-0.25, -0.95, 0);
            grip.rotation.z = 1.25;
            lowerTalon.add(grip);

            upperPivot.add(lowerTalon);
            prongGroup.add(upperPivot);
            this.clawHead.add(prongGroup);

            this.prongs.push({
                upperPivot,
                lowerTalon,
                linkage: linkageRod
            });
        }
    }

    /**
     * Genera la montaña volumétrica 3D de premios apilados físicamente
     * con sombras y profundidad real. Soporta 'gourmet' (hamburguesa, papas, tacos, empanadas, postres)
     * y 'plushies'.
     */
    spawnPlushieMountain3D() {
        // Limpiar premios previos
        this.plushies.forEach(p => this.scene.remove(p.mesh));
        this.plushies = [];

        const startX = -2.4;
        const endX = 5.2;
        const startZ = -3.8;
        const endZ = 3.8;

        const isGourmet = (this.currentTheme === 'gourmet');

        // Distribución en capas volumétricas
        for (let x = startX; x <= endX; x += 0.85) {
            for (let z = startZ; z <= endZ; z += 0.85) {
                const radius = isGourmet ? 0.58 : (0.52 + Math.random() * 0.12);

                // Forma de colina: más alto hacia el centro y fondo
                const distCenter = Math.sqrt(Math.pow(x - 1.5, 2) + Math.pow(z, 2));
                const heightOffset = Math.max(0, 1.8 - distCenter * 0.35);
                const posY = -4.5 + radius + heightOffset + (Math.random() * 0.3);

                let mesh;
                let prizeName = '';
                let prizeEmoji = '🎁';

                if (isGourmet) {
                    const food = FOOD_PRIZES[Math.floor(Math.random() * FOOD_PRIZES.length)];
                    mesh = food.create();
                    prizeName = food.name;
                    prizeEmoji = food.emoji;

                    mesh.position.set(
                        x + (Math.random() * 0.22 - 0.11),
                        posY,
                        z + (Math.random() * 0.22 - 0.11)
                    );
                    mesh.rotation.y = Math.random() * Math.PI * 2;
                    if (food.type === 'taco' || food.type === 'empanada') {
                        mesh.rotation.x = (Math.random() - 0.5) * 0.25;
                        mesh.rotation.z = (Math.random() - 0.5) * 0.25;
                    }
                } else {
                    const proto = PLUSHIE_COLORS[Math.floor(Math.random() * PLUSHIE_COLORS.length)];
                    prizeName = proto.name;
                    prizeEmoji = proto.emoji || '🧸';

                    const plushieGeo = new THREE.SphereGeometry(radius, 24, 24);
                    const plushieMat = new THREE.MeshStandardMaterial({
                        color: proto.color,
                        roughness: 0.55,
                        metalness: 0.05
                    });

                    mesh = new THREE.Mesh(plushieGeo, plushieMat);
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
                }

                this.scene.add(mesh);
                this.plushies.push({
                    mesh,
                    name: prizeName,
                    emoji: prizeEmoji,
                    radius,
                    initialY: posY,
                    isTop: posY > -3.2 // Premios de la cima que la garra puede agarrar
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

        // Modo TV Kiosco Clásico
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

        // ⛶ Pantalla Completa NATIVA EXCLUSIVA de la Máquina (Solo el mueble Arcade)
        const toggleMachineFullscreen = () => {
            const cabinet = document.querySelector('.arcade-cabinet') || document.querySelector('.arcade-viewport');
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (cabinet.requestFullscreen) {
                    cabinet.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
                } else if (cabinet.webkitRequestFullscreen) {
                    cabinet.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        };

        const btnMachineFull = document.getElementById('btnMachineFullscreen');
        if (btnMachineFull) btnMachineFull.addEventListener('click', toggleMachineFullscreen);

        const btnCabinetFull = document.getElementById('btnCabinetFullscreen');
        if (btnCabinetFull) btnCabinetFull.addEventListener('click', toggleMachineFullscreen);

        // Reajuste de resolución al entrar o salir de pantalla completa
        const handleFullscreenChange = () => {
            const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
            document.body.classList.toggle('machine-fullscreen-active', isFull);
            setTimeout(() => {
                const w = this.container.clientWidth;
                const h = this.container.clientHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            }, 120);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
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
            this.targetClawAngle = 0.15; // Reposo relajado
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
        this.targetClawAngle = 1.0; // ¡LA GARRA SE ABRE AMPLIA Y VISIBLEMENTE AL DESCENDER!
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

        // 2. Descenso en Y (Bajada de la garra abierta)
        if (this.state === 'DROPPING') {
            this.clawPos.y -= 0.12;
            this.targetClawAngle = 1.0; // Asegura que las tenazas estén totalmente abiertas al bajar

            // Detección de contacto con la montaña en la posición (X, Z) actual
            if (this.clawPos.y <= -2.4) {
                this.clawPos.y = -2.4;
                this.state = 'GRABBING';
                this.targetClawAngle = 0.05; // Cierra firmemente las tenazas sobre el producto
                if (window.soundFX) window.soundFX.playClawGrab();

                this.detectPlushieCollision3D();
            }
        }

        // 3. Sujeción de tenazas
        if (this.state === 'GRABBING') {
            if (Math.abs(this.clawAngle - this.targetClawAngle) < 0.08) {
                this.state = 'LIFTING';
            }
        }

        // 4. Elevación de la garra (LIFTING con producto atrapado)
        if (this.state === 'LIFTING') {
            this.clawPos.y += 0.09;
            this.targetClawAngle = 0.05; // Mantiene el agarre firme

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

        // 5. Traslado automático al depósito de premios (Frontal Izquierda)
        if (this.state === 'RETURNING') {
            this.targetClawAngle = 0.05; // Continúa sujetando el premio en el trayecto
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
                this.state = 'RELEASING';
                this.targetClawAngle = 1.0; // ¡Abre ampliamente sobre el depósito y suelta el premio!

                if (this.grabbedPlushie) {
                    this.onWinPrize3D(this.grabbedPlushie);
                    this.grabbedPlushie = null;
                } else {
                    this.onMissed3D();
                }
            }
        }

        // 1. Cinemática de apertura/cierre de tenazas y pistón central (Mecanismo real de tijera)
        this.clawAngle += (this.targetClawAngle - this.clawAngle) * 0.18;

        // El vástago del pistón central baja al abrir (empuja bielas hacia afuera) y sube al cerrar
        if (this.pistonShaft) {
            this.pistonShaft.position.y = -0.15 - (this.clawAngle * 0.45);
        }

        // Animar las 3 tenazas articuladas
        this.prongs.forEach(prong => {
            // Rotación del brazo superior (abre hacia afuera en abanico, cierra hacia el centro)
            const openOffset = (this.clawAngle * 0.85) - 0.38;
            prong.upperPivot.rotation.z = openOffset;

            // Articulación de la pinza inferior curvada (se expande hacia afuera al abrir, se curva hacia adentro al cerrar)
            prong.lowerTalon.rotation.z = 0.75 - (this.clawAngle * 0.85);

            // Orientación de la biela de empuje
            if (prong.linkage) {
                prong.linkage.rotation.z = (this.clawAngle * 0.35) - 0.15;
            }
        });

        // 2. Física de inercia y balanceo pendular del cable (Sway)
        const accelX = (this.clawPos.x - this.prevClawX);
        const accelZ = (this.clawPos.z - this.prevClawZ);
        this.prevClawX = this.clawPos.x;
        this.prevClawZ = this.clawPos.z;

        // Amortiguación armónica
        this.swayVelX += -accelX * 0.35 - this.swayX * 0.08;
        this.swayVelZ += -accelZ * 0.35 - this.swayZ * 0.08;
        this.swayVelX *= 0.94;
        this.swayVelZ *= 0.94;
        this.swayX += this.swayVelX;
        this.swayZ += this.swayVelZ;

        // Aplicar balanceo a la cabeza de la garra
        this.clawHead.rotation.z = this.swayX;
        this.clawHead.rotation.x = -this.swayZ;

        // ----------------------------------------------------
        // ACTUALIZAR MODELOS 3D EN LA ESCENA
        // ----------------------------------------------------
        // Mover viga transversal en Z (siempre anclada en el riel superior del techo Y = 4.8)
        this.crossbeam.position.y = 4.8;
        this.crossbeam.position.z = this.clawPos.z;
        // Mover carro en X
        this.trolley.position.x = this.clawPos.x;
        // Mover cabeza de garra
        this.clawHead.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);

        // Longitud del cable en 3D (desde polea en Y=4.6 hasta anilla superior de la garra en Y=clawPos.y + 0.95)
        const topAttachY = -0.2;
        const clawAttachWorldY = this.clawPos.y + 0.95;
        const cableLength = Math.max(0.1, (4.8 + topAttachY) - clawAttachWorldY);
        this.cableMesh.scale.y = cableLength;
        this.cableMesh.position.y = topAttachY - (cableLength / 2);

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

    showWinBanner(prize) {
        let banner = document.getElementById('winBannerToast');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'winBannerToast';
            banner.className = 'win-banner-toast';
            this.container.appendChild(banner);
        }
        banner.innerHTML = `
            <span class="prize-emoji">${prize.emoji || '🎁'}</span>
            <div class="prize-title">¡Premio Obtenido!</div>
            <div class="prize-name">${prize.name || 'Premio Sorpresa'}</div>
        `;
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2800);
    }

    onWinPrize3D(prize) {
        if (window.soundFX) window.soundFX.playWin();

        // Mostrar notificación de premio en pantalla
        this.showWinBanner(prize);

        // Iluminar la compuerta exterior de entrega de premios
        const prizeDoor = document.getElementById('prizeDispenserDoor');
        if (prizeDoor) {
            prizeDoor.classList.add('glow-win');
            setTimeout(() => prizeDoor.classList.remove('glow-win'), 3800);
        }

        // Caída física hacia el interior del depósito/tolva
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
            this.targetClawAngle = 0.15; // Regresa al reposo relajado
            this.spawnPlushieMountain3D(); // Reponer montaña
        }, 1500);
    }

    onMissed3D() {
        if (window.soundFX) window.soundFX.playMiss();
        setTimeout(() => {
            this.state = this.credits > 0 ? 'READY' : 'WAITING_COIN';
            this.targetClawAngle = 0.15; // Regresa al reposo relajado
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
