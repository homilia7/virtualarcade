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

/** 1. 🍔 Hamburguesa Doble Gourmet con Semillas de Sésamo, Queso Fundido y Pepinillos */
function createBurgerMesh() {
    const burger = new THREE.Group();

    // Materiales PBR de alta definición
    const bunTopMat = new THREE.MeshStandardMaterial({
        color: 0xc87b28,
        roughness: 0.35,
        metalness: 0.02
    });
    const bunBottomMat = new THREE.MeshStandardMaterial({
        color: 0xb36720,
        roughness: 0.55,
        metalness: 0.02
    });
    const pattyMat = new THREE.MeshStandardMaterial({
        color: 0x2b1509,
        roughness: 0.88,
        metalness: 0.05
    });
    const cheeseMat = new THREE.MeshStandardMaterial({
        color: 0xffa000,
        roughness: 0.22,
        metalness: 0.05
    });
    const tomatoMat = new THREE.MeshStandardMaterial({
        color: 0xd32f2f,
        roughness: 0.18,
        metalness: 0.08
    });
    const pickleMat = new THREE.MeshStandardMaterial({
        color: 0x33691e,
        roughness: 0.32,
        metalness: 0.05
    });
    const lettuceMat = new THREE.MeshStandardMaterial({
        color: 0x43a047,
        roughness: 0.55
    });
    const sesameMat = new THREE.MeshStandardMaterial({
        color: 0xfffaea,
        roughness: 0.45
    });

    // 1. Pan inferior tostado
    const bunBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.60, 0.22, 32), bunBottomMat);
    bunBottom.position.y = -0.38;
    bunBottom.castShadow = true;
    burger.add(bunBottom);

    // 2. Hojas de lechuga rizada batavia ondulante (Capa de base)
    for (let i = 0; i < 7; i++) {
        const leafAngle = (i * Math.PI * 2) / 7;
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.45), lettuceMat);
        leaf.position.set(Math.cos(leafAngle) * 0.52, -0.25, Math.sin(leafAngle) * 0.52);
        leaf.rotation.set(0.18 * Math.sin(leafAngle), leafAngle, 0.22);
        leaf.castShadow = true;
        burger.add(leaf);
    }

    // 3. Carne Angus gruesa a la parrilla con borde tostado
    const patty = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.28, 32), pattyMat);
    patty.position.y = -0.12;
    patty.castShadow = true;
    burger.add(patty);

    // 4. Queso Cheddar Americano fundido con esquinas caídas sobre la carne
    const cheeseCenter = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.045, 0.96), cheeseMat);
    cheeseCenter.position.y = 0.03;
    cheeseCenter.rotation.y = Math.PI / 4;
    cheeseCenter.castShadow = true;
    burger.add(cheeseCenter);

    // Esquinas caídas del queso derretido
    for (let c = 0; c < 4; c++) {
        const cAngle = (c * Math.PI / 2) + Math.PI / 4;
        const drip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.04), cheeseMat);
        drip.position.set(Math.cos(cAngle) * 0.62, -0.04, Math.sin(cAngle) * 0.62);
        drip.rotation.y = -cAngle + Math.PI / 2;
        drip.rotation.x = 0.4;
        burger.add(drip);
    }

    // 5. Rodajas de pepinillo agridulce
    for (let p = 0; p < 3; p++) {
        const pAngle = (p * Math.PI * 2) / 3;
        const pickle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 16), pickleMat);
        pickle.position.set(Math.cos(pAngle) * 0.28, 0.07, Math.sin(pAngle) * 0.28);
        pickle.rotation.y = pAngle;
        burger.add(pickle);
    }

    // 6. Rodajas de tomate jugoso maduro
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.09, 24), tomatoMat);
    t1.position.set(-0.18, 0.14, -0.1);
    t1.rotation.z = -0.05;
    burger.add(t1);

    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.09, 24), tomatoMat);
    t2.position.set(0.18, 0.15, 0.12);
    t2.rotation.z = 0.05;
    burger.add(t2);

    // 7. Pan Brioche superior esponjoso y abombado
    const bunTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.66, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52),
        bunTopMat
    );
    bunTop.scale.set(1.0, 0.62, 1.0);
    bunTop.position.y = 0.20;
    bunTop.castShadow = true;
    burger.add(bunTop);

    // 8. Semillas de sésamo individuales en el pan
    const sesameGeo = new THREE.SphereGeometry(0.026, 8, 8);
    sesameGeo.scale(1.4, 0.5, 0.9);
    const seedPositions = [
        [0, 0.56, 0], [0.22, 0.53, 0.12], [-0.20, 0.52, 0.18],
        [0.32, 0.46, -0.15], [-0.30, 0.48, -0.12], [0.08, 0.51, -0.32],
        [-0.08, 0.52, 0.34], [0.42, 0.38, 0.22], [-0.38, 0.40, 0.18],
        [0.18, 0.48, 0.32], [-0.18, 0.47, -0.28], [0.38, 0.42, -0.18]
    ];
    seedPositions.forEach(pos => {
        const seed = new THREE.Mesh(sesameGeo, sesameMat);
        seed.position.set(pos[0], pos[1], pos[2]);
        seed.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
        burger.add(seed);
    });

    burger.scale.set(1.15, 1.15, 1.15);
    return burger;
}

/** 2. 🍟 Papas Fritas Crujientes en Caja Cónica Realista con Emblema Dorado */
function createFriesMesh() {
    const fries = new THREE.Group();

    const boxRedMat = new THREE.MeshStandardMaterial({
        color: 0xd50000,
        roughness: 0.28,
        metalness: 0.05
    });
    const emblemMat = new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        roughness: 0.25,
        metalness: 0.35
    });

    // Base inferior de la caja
    const boxBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.5, 0.42), boxRedMat);
    boxBase.position.y = -0.35;
    boxBase.castShadow = true;
    fries.add(boxBase);

    // Respaldo alto de la caja
    const boxBack = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.55, 0.06), boxRedMat);
    boxBack.position.set(0, 0.08, -0.20);
    boxBack.rotation.x = -0.1;
    fries.add(boxBack);

    // Frontal rebajado (scoop) para exhibir las papas
    const boxFront = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.35, 0.06), boxRedMat);
    boxFront.position.set(0, -0.05, 0.20);
    boxFront.rotation.x = 0.1;
    fries.add(boxFront);

    // Paredes laterales inclinadas
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.44), boxRedMat);
    wallLeft.position.set(-0.38, -0.02, 0);
    wallLeft.rotation.z = 0.12;
    fries.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.44), boxRedMat);
    wallRight.position.set(0.38, -0.02, 0);
    wallRight.rotation.z = -0.12;
    fries.add(wallRight);

    // Emblema arcade dorado en el frontal
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16), emblemMat);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, -0.08, 0.23);
    fries.add(emblem);

    // Papas Fritas doradas y crujientes con variación de tostado
    const fryMats = [
        new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.52 }),
        new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.50 }),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.58 }),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.54 })
    ];

    for (let i = 0; i < 22; i++) {
        const len = 0.70 + Math.random() * 0.45;
        const fryGeo = new THREE.BoxGeometry(0.08, len, 0.08);
        const fry = new THREE.Mesh(fryGeo, fryMats[i % fryMats.length]);
        const offX = (Math.random() - 0.5) * 0.58;
        const offZ = (Math.random() - 0.5) * 0.28;
        fry.position.set(offX, 0.12 + len / 2 - 0.25, offZ);
        fry.rotation.set(
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.5) * 0.8,
            (offX / 0.58) * 0.42 + (Math.random() - 0.5) * 0.15
        );
        fry.castShadow = true;
        fries.add(fry);
    }

    fries.scale.set(1.15, 1.15, 1.15);
    return fries;
}

/** 3. 🌮 Taco al Pastor Supremo con Tortilla Curva, Piña Asada, Limón y Cilantro */
function createTacoMesh() {
    const taco = new THREE.Group();

    const tortillaMat = new THREE.MeshStandardMaterial({
        color: 0xf3ba6d,
        roughness: 0.68,
        metalness: 0.02
    });
    const meatMat = new THREE.MeshStandardMaterial({
        color: 0x8a230c,
        roughness: 0.85,
        metalness: 0.05
    });
    const pineappleMat = new THREE.MeshStandardMaterial({
        color: 0xffd600,
        roughness: 0.25,
        metalness: 0.05
    });
    const onionMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.30
    });
    const cilantroMat = new THREE.MeshStandardMaterial({
        color: 0x2e7d32,
        roughness: 0.60
    });
    const limeRindMat = new THREE.MeshStandardMaterial({
        color: 0x2e7d32,
        roughness: 0.45
    });
    const limePulpMat = new THREE.MeshStandardMaterial({
        color: 0x76ff03,
        roughness: 0.25,
        metalness: 0.1
    });

    // Tortilla de maíz doblada en U con base curva
    const shellBottom = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 1.15, 20, 1, false, 0, Math.PI),
        tortillaMat
    );
    shellBottom.rotation.x = Math.PI / 2;
    shellBottom.rotation.z = Math.PI;
    shellBottom.position.y = -0.20;
    shellBottom.castShadow = true;
    taco.add(shellBottom);

    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.72, 1.15), tortillaMat);
    wall1.position.set(-0.28, 0.08, 0);
    wall1.rotation.z = -0.28;
    wall1.castShadow = true;
    taco.add(wall1);

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.72, 1.15), tortillaMat);
    wall2.position.set(0.28, 0.08, 0);
    wall2.rotation.z = 0.28;
    wall2.castShadow = true;
    taco.add(wall2);

    // Puntos de tostado artesanal en el comal
    const spotMat = new THREE.MeshStandardMaterial({ color: 0x8d5b24, roughness: 0.8 });
    for (let s = 0; s < 6; s++) {
        const spot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), spotMat);
        spot.scale.set(1.4, 0.2, 1.0);
        const side = (s % 2 === 0) ? -0.32 : 0.32;
        spot.position.set(side, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.9);
        taco.add(spot);
    }

    // Carne al pastor marinada
    const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 1.05, 16), meatMat);
    meat.rotation.x = Math.PI / 2;
    meat.position.y = -0.02;
    meat.castShadow = true;
    taco.add(meat);

    for (let m = 0; m < 8; m++) {
        const chunk = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.16), meatMat);
        chunk.position.set((Math.random() - 0.5) * 0.24, 0.12, (Math.random() - 0.5) * 0.9);
        chunk.rotation.set(Math.random(), Math.random(), Math.random());
        taco.add(chunk);
    }

    // Cubos de piña asada
    for (let p = 0; p < 5; p++) {
        const pine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.14), pineappleMat);
        pine.position.set((Math.random() - 0.5) * 0.20, 0.22, -0.4 + p * 0.2);
        pine.rotation.set(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5);
        taco.add(pine);
    }

    // Cebolla blanca fresca picada
    for (let o = 0; o < 14; o++) {
        const on = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), onionMat);
        on.position.set((Math.random() - 0.5) * 0.26, 0.24, (Math.random() - 0.5) * 0.9);
        taco.add(on);
    }

    // Cilantro fresco
    for (let c = 0; c < 18; c++) {
        const cil = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.05), cilantroMat);
        cil.position.set((Math.random() - 0.5) * 0.28, 0.25, (Math.random() - 0.5) * 0.95);
        cil.rotation.y = Math.random() * Math.PI;
        taco.add(cil);
    }

    // Gajo de limón verde al lado
    const lime = new THREE.Group();
    const limeRind = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.20, 0.12, 16, 1, false, 0, Math.PI * 0.6),
        limeRindMat
    );
    limeRind.rotation.x = Math.PI / 2;
    lime.add(limeRind);
    const limePulp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.17, 0.13, 16, 1, false, 0, Math.PI * 0.58),
        limePulpMat
    );
    limePulp.rotation.x = Math.PI / 2;
    lime.add(limePulp);
    lime.position.set(0.42, -0.18, 0.35);
    lime.rotation.set(0.4, 0.6, 0.2);
    taco.add(lime);

    taco.scale.set(1.15, 1.15, 1.15);
    return taco;
}

/** 4. 🥟 Empanada Criolla Dorada con Repulgue Trenzado Artesanal */
function createEmpanadaMesh() {
    const empanada = new THREE.Group();

    const doughMat = new THREE.MeshStandardMaterial({
        color: 0xe09744,
        roughness: 0.38,
        metalness: 0.04
    });
    const braidMat = new THREE.MeshStandardMaterial({
        color: 0xb56d20,
        roughness: 0.44,
        metalness: 0.05
    });

    // Masa inflada en media luna
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 28, 20, 0, Math.PI, 0, Math.PI),
        doughMat
    );
    body.scale.set(1.0, 0.44, 0.60);
    body.rotation.x = -Math.PI / 2;
    body.position.y = -0.04;
    body.castShadow = true;
    empanada.add(body);

    // Repulgue trenzado artesanal de 16 pliegues entrelazados
    const braidCount = 16;
    const radius = 0.72;
    for (let i = 0; i <= braidCount; i++) {
        const t = (i / braidCount) * Math.PI;
        const bx = Math.cos(t) * radius;
        const bz = Math.sin(t) * (radius * 0.60);
        const fold = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.042, 10, 16), braidMat);
        fold.position.set(bx, 0.03, bz);
        fold.rotation.x = Math.PI / 2;
        fold.rotation.z = -t + Math.PI / 4;
        fold.castShadow = true;
        empanada.add(fold);
    }

    // Barniz de huevo horneado satinado
    const gloss = new THREE.Mesh(
        new THREE.SphereGeometry(0.50, 16, 12, 0, Math.PI, 0, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xffd580, roughness: 0.20, transparent: true, opacity: 0.38 })
    );
    gloss.scale.set(1.0, 0.46, 0.58);
    gloss.rotation.x = -Math.PI / 2;
    gloss.position.y = -0.03;
    empanada.add(gloss);

    empanada.scale.set(1.2, 1.2, 1.2);
    return empanada;
}

/** 5. 🍩 Dona Gourmet Glaseada de Fresa con Chispas y Gotas de Glaseado */
function createDessertMesh() {
    const dessert = new THREE.Group();

    const doughMat = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        roughness: 0.60,
        metalness: 0.02
    });
    const glazeMat = new THREE.MeshStandardMaterial({
        color: 0xff1493,
        roughness: 0.10,
        metalness: 0.08
    });
    const drizzleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.18
    });

    // 1. Masa de dona frita esponjosa dorada
    const dough = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.26, 28, 48), doughMat);
    dough.rotation.x = Math.PI / 2;
    dough.castShadow = true;
    dessert.add(dough);

    // Cinta de fritura ecuatorial dorada suave
    const fryRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.56, 0.264, 12, 48),
        new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.75, transparent: true, opacity: 0.6 })
    );
    fryRing.rotation.x = Math.PI / 2;
    fryRing.scale.set(1.0, 1.0, 0.25);
    dessert.add(fryRing);

    // 2. Glaseado espejo grueso de fresa
    const glaze = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.272, 20, 48), glazeMat);
    glaze.rotation.x = Math.PI / 2;
    glaze.position.y = 0.06;
    glaze.scale.set(1.0, 1.0, 0.95);
    dessert.add(glaze);

    // Gotas de glaseado escurriendo orgánicamente
    for (let d = 0; d < 8; d++) {
        const dAngle = (d * Math.PI * 2) / 8 + Math.random() * 0.3;
        const drip = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), glazeMat);
        drip.scale.set(1.0, 1.5, 0.8);
        drip.position.set(Math.cos(dAngle) * 0.76, 0.01, Math.sin(dAngle) * 0.76);
        dessert.add(drip);
    }

    // 3. Chispitas multicolores 3D (Sprinkles)
    const sprinkleColors = [0xffffff, 0x00e5ff, 0xffee58, 0x76ff03, 0x7c4dff, 0xff9100];
    for (let i = 0; i < 32; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 0.40 + Math.random() * 0.30;
        const s = new THREE.Mesh(
            new THREE.CylinderGeometry(0.024, 0.024, 0.09, 8),
            new THREE.MeshStandardMaterial({ color: sprinkleColors[i % sprinkleColors.length], roughness: 0.25 })
        );
        s.position.set(Math.cos(angle) * rad, 0.30, Math.sin(angle) * rad);
        s.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
        dessert.add(s);
    }

    // 4. Espirales de chocolate blanco
    for (let z = 0; z < 5; z++) {
        const dz = new THREE.Mesh(new THREE.TorusGeometry(0.38 + z * 0.07, 0.012, 8, 24, Math.PI * 0.8), drizzleMat);
        dz.rotation.x = Math.PI / 2;
        dz.rotation.z = z * 0.6;
        dz.position.y = 0.32;
        dessert.add(dz);
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

        // 3. Renderizador WebGL de Alta Fidelidad y Resolución Fotográfica
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        // Entorno de iluminación IBL de estudio para reflejos reales de cromo y acero en la garra y cadena
        this.initStudioEnvironment();

        // 4. Luces en tiempo real
        // Luz ambiente calibrada para mantener contraste y sombras en metales
        const ambient = new THREE.AmbientLight(0xffffff, 0.38);
        this.scene.add(ambient);

        // Foco cenital principal con proyección de sombras nítidas de 2048px
        this.spotLight = new THREE.SpotLight(0xfff8f5, 1.25);
        this.spotLight.position.set(0, 9, 2);
        this.spotLight.angle = Math.PI / 3;
        this.spotLight.penumbra = 0.35;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        this.spotLight.shadow.camera.near = 1;
        this.spotLight.shadow.camera.far = 15;
        this.spotLight.shadow.bias = -0.0004;
        this.scene.add(this.spotLight);

        // Luz Neón Cian (Pilar Izquierdo)
        const cyanLight = new THREE.PointLight(0x00e5ff, 1.2, 16);
        cyanLight.position.set(-6, 2, 2);
        this.scene.add(cyanLight);

        // Luz Neón Magenta (Pilar Derecho)
        const pinkLight = new THREE.PointLight(0xff1493, 1.2, 16);
        pinkLight.position.set(6, 2, 2);
        this.scene.add(pinkLight);

        // Foco frontal suave calibrado para no sobreexponer ni crear velo blanco en el cromo
        const clawFrontLight = new THREE.DirectionalLight(0xdbeafe, 0.28);
        clawFrontLight.position.set(0, 6, 9);
        this.scene.add(clawFrontLight);

        // Redimensionamiento
        window.addEventListener('resize', () => {
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    /**
     * Genera un mapa de entorno HD CubeTexture de 6 caras para cromo y acero espejo puro.
     * Incluye línea de horizonte ultra-nítida de alto contraste, cielo metálico y destellos neón.
     */
    initStudioEnvironment() {
        try {
            const createFace = (drawFn) => {
                const c = document.createElement('canvas');
                c.width = 256;
                c.height = 256;
                const ctx = c.getContext('2d');
                if (ctx) drawFn(ctx);
                return c;
            };

            const drawSide = (ctx, accent) => {
                // Mitad superior: Cielo de estudio con degradado metálico plata
                const skyGrad = ctx.createLinearGradient(0, 0, 0, 128);
                skyGrad.addColorStop(0.0, '#3a4756');  // Gris acero oscuro superior
                skyGrad.addColorStop(0.5, '#75889e');  // Tono medio plata
                skyGrad.addColorStop(0.85, '#dbe5f0'); // Plata brillante
                skyGrad.addColorStop(1.0, '#ffffff');  // Destello blanco puro en el horizonte
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, 256, 128);

                // Línea de horizonte nítida de alto contraste (esencial para la percepción de cromo espejo)
                ctx.fillStyle = '#0a0e14';
                ctx.fillRect(0, 128, 256, 6);

                // Mitad inferior: Suelo de estudio / arcade con degradado oscuro
                const groundGrad = ctx.createLinearGradient(0, 134, 0, 256);
                groundGrad.addColorStop(0.0, '#161d26');
                groundGrad.addColorStop(0.4, '#242e3d');
                groundGrad.addColorStop(1.0, '#0a0d12');
                ctx.fillStyle = groundGrad;
                ctx.fillRect(0, 134, 256, 122);

                // Reflejos específicos por cara
                if (accent === 'front') {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.fillRect(48, 40, 160, 16);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                    ctx.fillRect(36, 36, 184, 24);
                } else if (accent === 'cyan') {
                    const cyanG = ctx.createLinearGradient(116, 0, 140, 0);
                    cyanG.addColorStop(0, 'rgba(0, 229, 255, 0.0)');
                    cyanG.addColorStop(0.5, 'rgba(0, 229, 255, 0.95)');
                    cyanG.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
                    ctx.fillStyle = cyanG;
                    ctx.fillRect(116, 40, 24, 166);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(126, 50, 4, 146);
                } else if (accent === 'pink') {
                    const pinkG = ctx.createLinearGradient(116, 0, 140, 0);
                    pinkG.addColorStop(0, 'rgba(255, 20, 147, 0.0)');
                    pinkG.addColorStop(0.5, 'rgba(255, 20, 147, 0.95)');
                    pinkG.addColorStop(1, 'rgba(255, 20, 147, 0.0)');
                    ctx.fillStyle = pinkG;
                    ctx.fillRect(116, 40, 24, 166);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(126, 50, 4, 146);
                } else if (accent === 'back') {
                    ctx.fillStyle = 'rgba(220, 235, 255, 0.6)';
                    ctx.fillRect(60, 60, 136, 10);
                }
            };

            const drawTop = (ctx) => {
                ctx.fillStyle = '#2b3644';
                ctx.fillRect(0, 0, 256, 256);
                const glow = ctx.createRadialGradient(128, 128, 20, 128, 128, 110);
                glow.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
                glow.addColorStop(0.5, 'rgba(240, 246, 255, 0.85)');
                glow.addColorStop(0.8, 'rgba(150, 175, 205, 0.4)');
                glow.addColorStop(1.0, 'rgba(43, 54, 68, 0.0)');
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, 256, 256);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(80, 80, 96, 96);
            };

            const drawBottom = (ctx) => {
                ctx.fillStyle = '#0d1117';
                ctx.fillRect(0, 0, 256, 256);
                const floorGrad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
                floorGrad.addColorStop(0, 'rgba(30, 41, 59, 0.6)');
                floorGrad.addColorStop(1, 'rgba(10, 14, 20, 0.0)');
                ctx.fillStyle = floorGrad;
                ctx.fillRect(0, 0, 256, 256);
            };

            const px = createFace((ctx) => drawSide(ctx, 'cyan'));
            const nx = createFace((ctx) => drawSide(ctx, 'pink'));
            const py = createFace(drawTop);
            const ny = createFace(drawBottom);
            const pz = createFace((ctx) => drawSide(ctx, 'front'));
            const nz = createFace((ctx) => drawSide(ctx, 'back'));

            const cubeTexture = new THREE.CubeTexture([px, nx, py, ny, pz, nz]);
            cubeTexture.needsUpdate = true;
            this.chromeCubeMap = cubeTexture;

            // Compilar PMREM para el cubemap si el renderizador está disponible
            try {
                const pmremGen = new THREE.PMREMGenerator(this.renderer);
                pmremGen.compileCubemapShader();
                this.scene.environment = pmremGen.fromCubemap(cubeTexture).texture;
                pmremGen.dispose();
            } catch (pmremErr) {
                this.scene.environment = cubeTexture;
            }
        } catch (e) {
            console.warn('Environment map warning:', e);
        }
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
            transmission: 0.95
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

        // Materiales de Grado Industrial - 100% Cromo Espejo y Acero Plateado Auténtico
        const silverChromeMat = new THREE.MeshStandardMaterial({
            color: 0xdce6f2,          // Plata / cromo metálico brillante y puro
            metalness: 0.98,          // Metal puro (98%)
            roughness: 0.03,          // Acabado espejo pulido de cromo puro (reflejos hiper-nítidos)
            envMap: this.chromeCubeMap || this.scene.environment,
            envMapIntensity: 2.5
        });

        const silverSteelMat = new THREE.MeshStandardMaterial({
            color: 0x9bb0c4,          // Acero estructural plateado satinado
            metalness: 0.92,
            roughness: 0.10,          // Ligeramente satinado pero reflectante
            envMap: this.chromeCubeMap || this.scene.environment,
            envMapIntensity: 1.8
        });

        const silverBoltMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,          // Pernos y herrajes de plata espejo
            metalness: 1.0,
            roughness: 0.02,
            envMap: this.chromeCubeMap || this.scene.environment,
            envMapIntensity: 3.0
        });

        // 1. Rieles Longitudinales (Eje Z en el techo)
        const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 9.8, 16);
        const railLeft = new THREE.Mesh(railGeo, silverChromeMat);
        railLeft.rotation.x = Math.PI / 2;
        railLeft.position.set(-5.5, 4.8, 0);
        this.scene.add(railLeft);

        const railRight = new THREE.Mesh(railGeo, silverChromeMat);
        railRight.rotation.x = Math.PI / 2;
        railRight.position.set(5.5, 4.8, 0);
        this.scene.add(railRight);

        // 2. Viga Transversal (Eje X que se desplaza en Z en el techo a Y = 4.8)
        this.crossbeam = new THREE.Group();
        const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 11.2, 16);
        const beamMesh = new THREE.Mesh(beamGeo, silverChromeMat);
        beamMesh.rotation.z = Math.PI / 2;
        this.crossbeam.add(beamMesh);

        // Bloques y rodamientos guía en los extremos que corren sobre los rieles
        const guideGeo = new THREE.BoxGeometry(0.35, 0.25, 0.45);
        const guideLeft = new THREE.Mesh(guideGeo, silverSteelMat);
        guideLeft.position.set(-5.5, 0, 0);
        this.crossbeam.add(guideLeft);

        const guideRight = new THREE.Mesh(guideGeo, silverSteelMat);
        guideRight.position.set(5.5, 0, 0);
        this.crossbeam.add(guideRight);

        // Anclaje permanente de la viga en el riel superior del techo
        this.crossbeam.position.set(0, 4.8, this.clawPos.z);
        this.scene.add(this.crossbeam);

        // 3. Carro de Transporte (Trolley con polea y motor en plata/acero)
        this.trolley = new THREE.Group();
        const trolleyBoxGeo = new THREE.BoxGeometry(1.2, 0.35, 1.0);
        const trolleyMesh = new THREE.Mesh(trolleyBoxGeo, silverSteelMat);
        this.trolley.add(trolleyMesh);

        // Polea cromada en el carro
        const pulleyGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 24);
        const pulleyMesh = new THREE.Mesh(pulleyGeo, silverChromeMat);
        pulleyMesh.rotation.z = Math.PI / 2;
        pulleyMesh.position.set(0, -0.2, 0);
        this.trolley.add(pulleyMesh);
        this.crossbeam.add(this.trolley);

        // 4. Cadena Metálica de Eslabones de Acero Cromado Realista
        // Eslabones ovalados entrelazados (Torus) que se extienden y recogen físicamente
        const linkGeo = new THREE.TorusGeometry(0.065, 0.018, 10, 18);
        linkGeo.scale(1.0, 1.45, 1.0); // Eslabón ovalado alargado de cadena real

        this.maxChainLinks = 44;
        this.chainMesh = new THREE.InstancedMesh(linkGeo, silverChromeMat, this.maxChainLinks);
        this.chainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.chainMesh.castShadow = true;
        this.scene.add(this.chainMesh);

        // 5. CABEZA DE LA GARRA METÁLICA DE PLATA REALISTA (CERO ROSA, CERO ELEMENTOS FLOTANTES)
        this.clawHead = new THREE.Group();
        this.clawHead.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);
        this.scene.add(this.clawHead);

        // Anilla giratoria superior de suspensión
        const swivelGeo = new THREE.TorusGeometry(0.18, 0.045, 16, 24);
        const swivelMesh = new THREE.Mesh(swivelGeo, silverChromeMat);
        swivelMesh.position.set(0, 0.95, 0);
        this.clawHead.add(swivelMesh);

        // Casquillo de sujeción cónico superior
        const topCapGeo = new THREE.CylinderGeometry(0.25, 0.62, 0.35, 32);
        const topCap = new THREE.Mesh(topCapGeo, silverChromeMat);
        topCap.position.y = 0.65;
        this.clawHead.add(topCap);

        // Cúpula / Domo Superior en Plata Pulida Brillante (Realista como en máquina real)
        const domeGeo = new THREE.SphereGeometry(0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, silverChromeMat);
        dome.position.y = 0.25;
        this.clawHead.add(dome);

        // Bisel / Corona de plata del domo
        const domeBezelGeo = new THREE.TorusGeometry(0.66, 0.05, 16, 32);
        const domeBezel = new THREE.Mesh(domeBezelGeo, silverChromeMat);
        domeBezel.rotation.x = Math.PI / 2;
        domeBezel.position.y = 0.25;
        this.clawHead.add(domeBezel);

        // Carcasa Principal Cilíndrica (Motor/Gearbox) en Acero Plateado
        const casingGeo = new THREE.CylinderGeometry(0.62, 0.68, 0.65, 32);
        const casing = new THREE.Mesh(casingGeo, silverSteelMat);
        casing.position.y = -0.1;
        this.clawHead.add(casing);

        // Anillo inferior cromado con reborde
        const baseRingGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 32);
        const baseRing = new THREE.Mesh(baseRingGeo, silverChromeMat);
        baseRing.position.y = -0.42;
        this.clawHead.add(baseRing);

        // Núcleo central inferior cerrado (Buje limpio en plata, sin varillas colgantes)
        const centerHubGeo = new THREE.CylinderGeometry(0.3, 0.15, 0.25, 24);
        const centerHub = new THREE.Mesh(centerHubGeo, silverChromeMat);
        centerHub.position.y = -0.55;
        this.clawHead.add(centerHub);

        // 6. Tres Tenazas Mecánicas Continuas de Plata Pulida (120° entre sí)
        // CERO partes sueltas, CERO elementos flotantes: cada tenaza es una curva 3D continua e indivisible
        const fingerCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.00,  0.00, 0.0), // Bisagra superior en el cuerpo
            new THREE.Vector3(0.18, -0.55, 0.0), // Brazo superior descendente
            new THREE.Vector3(0.32, -1.15, 0.0), // Codo exterior curvado
            new THREE.Vector3(0.22, -1.70, 0.0), // Curva hacia adentro
            new THREE.Vector3(-0.08, -2.15, 0.0), // Dedo curvado hacia el centro
            new THREE.Vector3(-0.35, -2.35, 0.0)  // Punta afilada dirigida al centro
        ]);
        const fingerGeo = new THREE.TubeGeometry(fingerCurve, 36, 0.075, 12, false);

        this.prongs = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const prongGroup = new THREE.Group();
            prongGroup.rotation.y = angle;

            // Horquilla de Montaje Superior en el cuerpo (Plata)
            const bracketGeo = new THREE.BoxGeometry(0.16, 0.22, 0.25);
            const bracket = new THREE.Mesh(bracketGeo, silverSteelMat);
            bracket.position.set(0.68, -0.42, 0);
            prongGroup.add(bracket);

            // Perno de articulación superior en plata
            const pinGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.32, 16);
            const pin = new THREE.Mesh(pinGeo, silverBoltMat);
            pin.rotation.x = Math.PI / 2;
            pin.position.set(0.68, -0.42, 0);
            prongGroup.add(pin);

            // PIVOTE COMPLETO DE LA TENAZA SÓLIDA DE PLATA
            const upperPivot = new THREE.Group();
            upperPivot.position.set(0.68, -0.42, 0);

            // Bisagra cilíndrica de sujeción
            const hingeJoint = new THREE.Mesh(
                new THREE.CylinderGeometry(0.085, 0.085, 0.22, 16),
                silverBoltMat
            );
            hingeJoint.rotation.x = Math.PI / 2;
            upperPivot.add(hingeJoint);

            // Cuerpo tubular continuo de la garra (Una sola pieza sólida sin uniones partidas)
            const fingerMesh = new THREE.Mesh(fingerGeo, silverChromeMat);
            fingerMesh.castShadow = true;
            upperPivot.add(fingerMesh);

            // Refuerzo en el codo de plata
            const knuckle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.09, 0.09, 0.18, 16),
                silverBoltMat
            );
            knuckle.rotation.x = Math.PI / 2;
            knuckle.position.set(0.32, -1.15, 0.0);
            upperPivot.add(knuckle);

            // Puntera suave de terminación en la punta de la garra
            const tipCap = new THREE.Mesh(
                new THREE.SphereGeometry(0.076, 16, 16),
                silverChromeMat
            );
            tipCap.position.set(-0.35, -2.35, 0.0);
            upperPivot.add(tipCap);

            prongGroup.add(upperPivot);
            this.clawHead.add(prongGroup);

            this.prongs.push({
                upperPivot
            });
        }
    }

    /**
     * Genera la piscina de premios 3D asentada sólidamente en el suelo
     * (Cero elementos flotando en el aire).
     */
    spawnPlushieMountain3D() {
        // Limpiar premios previos
        this.plushies.forEach(p => this.scene.remove(p.mesh));
        this.plushies = [];

        const startX = -2.2;
        const endX = 5.2;
        const startZ = -3.8;
        const endZ = 3.8;

        const isGourmet = (this.currentTheme === 'gourmet');

        // CAPA 1: Base asentada directamente sobre el suelo del gabinete (Y = -4.8)
        for (let x = startX; x <= endX; x += 0.88) {
            for (let z = startZ; z <= endZ; z += 0.88) {
                const radius = isGourmet ? 0.58 : (0.52 + Math.random() * 0.12);
                const posY = -4.32 + (Math.random() * 0.1); // Apoyado firme sobre el suelo

                let mesh;
                let prizeName = '';
                let prizeEmoji = '🎁';

                if (isGourmet) {
                    const food = FOOD_PRIZES[Math.floor(Math.random() * FOOD_PRIZES.length)];
                    mesh = food.create();
                    prizeName = food.name;
                    prizeEmoji = food.emoji;
                    mesh.position.set(x + (Math.random() * 0.2 - 0.1), posY, z + (Math.random() * 0.2 - 0.1));
                    mesh.rotation.y = Math.random() * Math.PI * 2;
                } else {
                    const proto = PLUSHIE_COLORS[Math.floor(Math.random() * PLUSHIE_COLORS.length)];
                    prizeName = proto.name;
                    prizeEmoji = proto.emoji || '🧸';

                    const plushieGeo = new THREE.SphereGeometry(radius, 20, 20);
                    const plushieMat = new THREE.MeshStandardMaterial({
                        color: proto.color,
                        roughness: 0.55,
                        metalness: 0.05
                    });
                    mesh = new THREE.Mesh(plushieGeo, plushieMat);
                    mesh.position.set(x, posY, z);
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
                    isTop: false
                });
            }
        }

        // CAPA 2: Premios apilados sobre la base (completamente apoyados, altura máxima -3.5, cero flotación)
        for (let x = startX + 0.44; x <= endX - 0.44; x += 0.88) {
            for (let z = startZ + 0.44; z <= endZ - 0.44; z += 0.88) {
                if (Math.random() < 0.65) {
                    const radius = isGourmet ? 0.58 : 0.52;
                    const posY = -3.55 + (Math.random() * 0.12); // Descansando sobre los premios de la base

                    let mesh;
                    let prizeName = '';
                    let prizeEmoji = '🎁';

                    if (isGourmet) {
                        const food = FOOD_PRIZES[Math.floor(Math.random() * FOOD_PRIZES.length)];
                        mesh = food.create();
                        prizeName = food.name;
                        prizeEmoji = food.emoji;
                        mesh.position.set(x + (Math.random() * 0.2 - 0.1), posY, z + (Math.random() * 0.2 - 0.1));
                        mesh.rotation.y = Math.random() * Math.PI * 2;
                    } else {
                        const proto = PLUSHIE_COLORS[Math.floor(Math.random() * PLUSHIE_COLORS.length)];
                        prizeName = proto.name;
                        prizeEmoji = proto.emoji || '🧸';

                        const plushieGeo = new THREE.SphereGeometry(radius, 20, 20);
                        const plushieMat = new THREE.MeshStandardMaterial({
                            color: proto.color,
                            roughness: 0.55,
                            metalness: 0.05
                        });
                        mesh = new THREE.Mesh(plushieGeo, plushieMat);
                        mesh.position.set(x, posY, z);
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                    }

                    this.scene.add(mesh);
                    this.plushies.push({
                        mesh,
                        name: prizeName,
                        emoji: prizeEmoji,
                        radius,
                        initialY: posY,
                        isTop: true // Premios de la cima que la garra puede agarrar
                    });
                }
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

            // Detección de contacto con la montaña en la posición (X, Z) actual (puntas tocan la comida a Y = -4.37)
            if (this.clawPos.y <= -1.6) {
                this.clawPos.y = -1.6;
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
                    this.clawPos.y - 1.65,
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
                        this.clawPos.y - 1.65,
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

        // 1. Cinemática de apertura/cierre de tenazas de plata maciza (Mecanismo real de arcade)
        this.clawAngle += (this.targetClawAngle - this.clawAngle) * 0.18;

        // Animar las 3 tenazas continuas de plata (abre hacia afuera al bajar, cierra al centro al atrapar)
        this.prongs.forEach(prong => {
            const angleZ = (this.clawAngle * 0.65) - 0.24;
            prong.upperPivot.rotation.z = angleZ;
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

        // Actualizar la Cadena de Eslabones Metálicos de Acero Cromado en 3D
        const chainTopY = 4.6;
        const chainBottomY = this.clawPos.y + 0.95;
        const chainSpan = Math.max(0.12, chainTopY - chainBottomY);
        const linkPitch = 0.135;
        const activeLinks = Math.min(this.maxChainLinks, Math.max(2, Math.floor(chainSpan / linkPitch) + 1));
        const stepY = chainSpan / activeLinks;

        const chainDummy = new THREE.Object3D();
        for (let i = 0; i < this.maxChainLinks; i++) {
            if (i < activeLinks) {
                chainDummy.position.set(this.clawPos.x, chainTopY - (i + 0.5) * stepY, this.clawPos.z);
                // Eslabones entrelazados alternando 0 y 90 grados en Y
                chainDummy.rotation.set(0, i % 2 === 0 ? 0 : Math.PI / 2, 0);
                chainDummy.scale.set(1, 1, 1);
            } else {
                chainDummy.position.set(0, -999, 0);
                chainDummy.scale.set(0, 0, 0);
            }
            chainDummy.updateMatrix();
            this.chainMesh.setMatrixAt(i, chainDummy.matrix);
        }
        this.chainMesh.instanceMatrix.needsUpdate = true;

        // Foco de luz siguiendo la garra sutilmente
        this.spotLight.target = this.clawHead;

        // Parallax sutil de la cámara 3D para dar sensación de profundidad física
        this.camera.position.x = (this.clawPos.x * 0.15);
        this.camera.position.y = 0.8 + (this.clawPos.z * 0.1);
        this.camera.lookAt(0, -0.6, 0);
    }

    detectPlushieCollision3D() {
        let closest = null;
        let minDist = 1.45; // Radio de agarre 3D optimizado

        // Prioridad 1: Premios en la cima (isTop)
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

        // Prioridad 2: Si no hubo en la cima pero la garra cayó justo encima de uno de la base
        if (!closest) {
            this.plushies.forEach(p => {
                const dx = this.clawPos.x - p.mesh.position.x;
                const dz = this.clawPos.z - p.mesh.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < 1.15) {
                    closest = p;
                }
            });
        }

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
