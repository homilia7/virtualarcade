/**
 * game.js - Motor 3D Real para "Virtual Clawcade" basado en Three.js / WebGL.
 * Entorno 3D con perspectiva, iluminación PBR, sombras dinámicas, rieles en X y Z,
 * garra articulada y montaña volumétrica de peluches tridimensionales.
 */

// Paleta de peluches kawaii pastel afelpados (idénticos a la foto real de referencia)
const PLUSHIE_COLORS = [
    { name: 'Osito Teddy Caramelo', color: 0xb07d58, earColor: 0x8a5a3a, muzzleColor: 0xf5ebd9, emoji: '🐻', hasBow: true },
    { name: 'Osito Vainilla Crema', color: 0xf5e5cb, earColor: 0xd6bf9c, muzzleColor: 0xffffff, emoji: '🧸' },
    { name: 'Conejito Rosa Bebé', color: 0xfbcfe8, earColor: 0xf472b6, muzzleColor: 0xfff0f5, emoji: '🐰', isBunny: true },
    { name: 'Osito Panda Suave', color: 0xffffff, earColor: 0x374151, muzzleColor: 0xf1f5f9, emoji: '🐼' },
    { name: 'Estrellita Pastel Suave', color: 0xfef08a, earColor: 0xfde047, muzzleColor: 0xfffbeb, emoji: '⭐', isStar: true },
    { name: 'Estrella Nube Celeste', color: 0xbae6fd, earColor: 0x7dd3fc, muzzleColor: 0xf0f9ff, emoji: '✨', isStar: true },
    { name: 'Osito Menta Pastel', color: 0xccfbf1, earColor: 0x99f6e4, muzzleColor: 0xf0fdfa, emoji: '🐻' },
    { name: 'Conejito Lavanda', color: 0xe9d5ff, earColor: 0xd8b4fe, muzzleColor: 0xfaf5ff, emoji: '🐰', isBunny: true },
    { name: 'Osito Polar Suave', color: 0xf8fafc, earColor: 0xe2e8f0, muzzleColor: 0xffffff, emoji: '🐻‍❄️' }
];

// ========================================================
// GENERADORES 3D PROCEDURALES DE COMIDA GOURMET REALISTA
// ========================================================

/** 1. 🍔 Hamburguesa Doble Gourmet con Semillas de Sésamo, Queso Fundido y Pepinillos */
function createBurgerMesh() {
    const burger = new THREE.Group();

    // Materiales PBR de alta definición con tonos ricos y contrastados (cero colores desteñidos)
    const bunTopMat = new THREE.MeshStandardMaterial({
        color: 0x9e5210,          // Pan brioche dorado tostado profundo
        roughness: 0.40,
        metalness: 0.02
    });
    const bunBottomMat = new THREE.MeshStandardMaterial({
        color: 0x85420c,
        roughness: 0.55,
        metalness: 0.02
    });
    const pattyMat = new THREE.MeshStandardMaterial({
        color: 0x1a0a03,          // Carne Angus gruesa a la parrilla oscura con corteza
        roughness: 0.90,
        metalness: 0.05
    });
    const cheeseMat = new THREE.MeshStandardMaterial({
        color: 0xf57c00,          // Cheddar fundido naranja profundo
        roughness: 0.25,
        metalness: 0.05
    });
    const tomatoMat = new THREE.MeshStandardMaterial({
        color: 0xb71c1c,          // Tomate maduro rojo oscuro
        roughness: 0.20,
        metalness: 0.08
    });
    const pickleMat = new THREE.MeshStandardMaterial({
        color: 0x2e5e18,          // Pepinillo verde oscuro
        roughness: 0.35,
        metalness: 0.05
    });
    const lettuceMat = new THREE.MeshStandardMaterial({
        color: 0x2e7d32,          // Lechuga fresca verde viva
        roughness: 0.55
    });
    const sesameMat = new THREE.MeshStandardMaterial({
        color: 0xf5eedc,
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
        color: 0xb71c1c,
        roughness: 0.30,
        metalness: 0.05
    });
    const emblemMat = new THREE.MeshStandardMaterial({
        color: 0xfbc02d,
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

    // Papas Fritas doradas y crujientes con variación de tostado profundo
    const fryMats = [
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.52 }),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.50 }),
        new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.58 }),
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
        color: 0xc68a3c,
        roughness: 0.70,
        metalness: 0.02
    });
    const meatMat = new THREE.MeshStandardMaterial({
        color: 0x6a1505,
        roughness: 0.85,
        metalness: 0.05
    });
    const pineappleMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.28,
        metalness: 0.05
    });
    const onionMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.35
    });
    const cilantroMat = new THREE.MeshStandardMaterial({
        color: 0x1b5e20,
        roughness: 0.60
    });
    const limeRindMat = new THREE.MeshStandardMaterial({
        color: 0x1b5e20,
        roughness: 0.45
    });
    const limePulpMat = new THREE.MeshStandardMaterial({
        color: 0x64dd17,
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
        color: 0xbf6718,
        roughness: 0.40,
        metalness: 0.04
    });
    const braidMat = new THREE.MeshStandardMaterial({
        color: 0x8a4007,
        roughness: 0.46,
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
        color: 0xad6b2d,
        roughness: 0.60,
        metalness: 0.02
    });
    const glazeMat = new THREE.MeshStandardMaterial({
        color: 0xc2185b,
        roughness: 0.12,
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

// Curva matemática helicoidal para el cable espiral negro tipo teléfono
class SpiralCableCurve extends THREE.Curve {
    constructor(radius = 0.12, turns = 11, height = 1.0) {
        super();
        this.radius = radius;
        this.turns = turns;
        this.height = height;
    }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const angle = t * Math.PI * 2 * this.turns;
        const x = Math.cos(angle) * this.radius;
        const y = -t * this.height;
        const z = Math.sin(angle) * this.radius;
        return optionalTarget.set(x, y, z);
    }
}

/**
 * Generador procedural de peluches kawaii afelpados de alta fidelidad
 * Idéntico a la fotografía de referencia de la máquina real (acabado terciopelo mate, orejitas, ojitos tiernos y cojines estrella).
 */
function createKawaiiPlushieMesh(proto, radius) {
    const group = new THREE.Group();
    const velvetMat = new THREE.MeshStandardMaterial({
        color: proto.color,
        roughness: 0.88,
        metalness: 0.0
    });
    const earMat = new THREE.MeshStandardMaterial({
        color: proto.earColor || proto.color,
        roughness: 0.85,
        metalness: 0.0
    });
    const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.25,
        metalness: 0.1
    });

    if (proto.isStar) {
        // Cojín estrella acolchado estilo kawaii
        const coreGeo = new THREE.SphereGeometry(radius * 0.9, 16, 16);
        const core = new THREE.Mesh(coreGeo, velvetMat);
        core.scale.set(1.15, 0.75, 1.15);
        core.castShadow = true;
        core.receiveShadow = true;
        group.add(core);

        // 5 puntas acolchadas de la estrella
        const pointGeo = new THREE.SphereGeometry(radius * 0.38, 12, 12);
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const pt = new THREE.Mesh(pointGeo, velvetMat);
            pt.scale.set(0.9, 0.65, 0.9);
            pt.position.set(Math.cos(angle) * radius * 0.82, 0, Math.sin(angle) * radius * 0.82);
            pt.castShadow = true;
            group.add(pt);
        }

        // Ojos tiernos en el cojín estrella
        const eyeGeo = new THREE.SphereGeometry(radius * 0.08, 8, 8);
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-radius * 0.25, radius * 0.12, radius * 0.72);
        group.add(eyeL);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(radius * 0.25, radius * 0.12, radius * 0.72);
        group.add(eyeR);

        return group;
    }

    // Peluche: cuerpo/cabeza afelpada
    const bodyGeo = new THREE.SphereGeometry(radius, 20, 20);
    const body = new THREE.Mesh(bodyGeo, velvetMat);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Orejas
    if (proto.isBunny) {
        const bunnyEarGeo = new THREE.CylinderGeometry(radius * 0.16, radius * 0.22, radius * 0.85, 12);
        const earL = new THREE.Mesh(bunnyEarGeo, earMat);
        earL.position.set(-radius * 0.45, radius * 1.05, 0);
        earL.rotation.z = 0.2;
        earL.castShadow = true;
        group.add(earL);

        const earR = new THREE.Mesh(bunnyEarGeo, earMat);
        earR.position.set(radius * 0.45, radius * 1.05, 0);
        earR.rotation.z = -0.2;
        earR.castShadow = true;
        group.add(earR);
    } else {
        const earGeo = new THREE.SphereGeometry(radius * 0.34, 14, 14);
        const earL = new THREE.Mesh(earGeo, earMat);
        earL.position.set(-radius * 0.68, radius * 0.68, 0);
        earL.castShadow = true;
        group.add(earL);

        const earR = new THREE.Mesh(earGeo, earMat);
        earR.position.set(radius * 0.68, radius * 0.68, 0);
        earR.castShadow = true;
        group.add(earR);
    }

    // Hocico crema / blanco
    const muzzleMat = new THREE.MeshStandardMaterial({
        color: proto.muzzleColor || 0xfffbeb,
        roughness: 0.82,
        metalness: 0.0
    });
    const muzzleGeo = new THREE.SphereGeometry(radius * 0.32, 12, 12);
    const muzzle = new THREE.Mesh(muzzleGeo, muzzleMat);
    muzzle.scale.set(1.0, 0.75, 0.45);
    muzzle.position.set(0, -radius * 0.12, radius * 0.84);
    group.add(muzzle);

    // Naricita
    const noseGeo = new THREE.SphereGeometry(radius * 0.09, 8, 8);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, -radius * 0.05, radius * 0.98);
    group.add(nose);

    // Manchas de panda
    if (proto.emoji === '🐼') {
        const patchGeo = new THREE.SphereGeometry(radius * 0.18, 10, 10);
        const patchMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.85 });
        const patchL = new THREE.Mesh(patchGeo, patchMat);
        patchL.scale.set(0.9, 1.2, 0.4);
        patchL.position.set(-radius * 0.32, radius * 0.14, radius * 0.85);
        patchL.rotation.z = -0.3;
        group.add(patchL);

        const patchR = new THREE.Mesh(patchGeo, patchMat);
        patchR.scale.set(0.9, 1.2, 0.4);
        patchR.position.set(radius * 0.32, radius * 0.14, radius * 0.85);
        patchR.rotation.z = 0.3;
        group.add(patchR);
    }

    // Ojitos tiernos
    const eyeGeo = new THREE.SphereGeometry(radius * 0.075, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-radius * 0.34, radius * 0.14, radius * 0.91);
    group.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(radius * 0.34, radius * 0.14, radius * 0.91);
    group.add(eyeR);

    return group;
}

class Real3DClawcade {
    constructor() {
        this.container = document.querySelector('.glass-chamber');
        this.canvas = document.getElementById('gameCanvas');

        // Estado del juego
        this.state = 'WAITING_COIN';
        this.credits = 1;
        this.currentTheme = 'plushies'; // Peluches estilo kawaii pastel por defecto (según referencia fotográfica)

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
        this.fallingPrize = null;
        this.releaseTimer = 0;

        // Modo Cámara Asomarse (Peep / Inspection Mode)
        this.isPeepMode = false;
        this.camOffsetX = 0;
        this.camOffsetZ = 0;

        // Físicas orgánicas del producto dentro de la garra (Inercia, balanceo, compresión y deslizamiento)
        this.prizePhysics = {
            tiltX: 0,
            tiltZ: 0,
            targetTiltX: 0,
            targetTiltZ: 0,
            targetYaw: 0,
            swayX: 0,
            swayZ: 0,
            swayVelX: 0,
            swayVelZ: 0,
            bounceY: 0,
            bounceVelY: 0,
            dipY: 0,
            dipVelY: 0,
            squish: 0,
            targetSquish: 0,
            willSlip: false,
            slipDropY: 0
        };

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

        // 1. Escena con fondo blanco perla suave de estudio fotográfico (idéntico a la foto real)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf6f7f9);

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

        // Entorno de iluminación IBL de estudio para reflejos de cromo en la garra
        this.initStudioEnvironment();

        // 4. Iluminación limpia de estudio fotográfico suave
        // Luz ambiente difusa blanca uniforme
        const ambient = new THREE.AmbientLight(0xffffff, 0.72);
        this.scene.add(ambient);

        // Foco cenital principal suave con sombras difusas
        this.spotLight = new THREE.SpotLight(0xffffff, 0.95);
        this.spotLight.position.set(0, 9, 2);
        this.spotLight.angle = Math.PI / 2.8;
        this.spotLight.penumbra = 0.55;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        this.spotLight.shadow.camera.near = 1;
        this.spotLight.shadow.camera.far = 15;
        this.spotLight.shadow.bias = -0.0004;

        // Objetivo del foco
        const spotTarget = new THREE.Object3D();
        spotTarget.position.set(0, -4.0, 0);
        this.scene.add(spotTarget);
        this.spotLight.target = spotTarget;
        this.scene.add(this.spotLight);

        // Luces laterales de relleno suave de estudio (sin neones de discoteca)
        const leftFill = new THREE.DirectionalLight(0xffffff, 0.32);
        leftFill.position.set(-6, 3, 5);
        this.scene.add(leftFill);

        const rightFill = new THREE.DirectionalLight(0xffffff, 0.32);
        rightFill.position.set(6, 3, 5);
        this.scene.add(rightFill);

        // Foco frontal sutil
        const clawFrontLight = new THREE.DirectionalLight(0xffffff, 0.24);
        clawFrontLight.position.set(0, 4, 8);
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
                // Mitad superior: Cielo de estudio con degradado metálico plata/acero auténtico
                const skyGrad = ctx.createLinearGradient(0, 0, 0, 128);
                skyGrad.addColorStop(0.0, '#2e3947');  // Gris acero oscuro superior
                skyGrad.addColorStop(0.5, '#607285');  // Tono medio plata
                skyGrad.addColorStop(0.85, '#a4b8cc'); // Plata satinada suave
                skyGrad.addColorStop(1.0, '#d0dee9');  // Destello satinado en el horizonte (sin quemar blancos)
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
                    ctx.fillStyle = 'rgba(215, 230, 245, 0.75)';
                    ctx.fillRect(48, 40, 160, 16);
                    ctx.fillStyle = 'rgba(215, 230, 245, 0.25)';
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
                glow.addColorStop(0, 'rgba(235, 245, 255, 0.85)');
                glow.addColorStop(0.5, 'rgba(195, 215, 235, 0.65)');
                glow.addColorStop(0.8, 'rgba(130, 155, 185, 0.3)');
                glow.addColorStop(1.0, 'rgba(43, 54, 68, 0.0)');
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, 256, 256);
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

            // Generar textura PMREM optimizada exclusivamente para materiales metálicos
            // (NO contamina la escena global para preservar saturación profunda en comida y peluches)
            try {
                const pmremGen = new THREE.PMREMGenerator(this.renderer);
                pmremGen.compileCubemapShader();
                this.chromeCubeMap = pmremGen.fromCubemap(cubeTexture).texture;
                pmremGen.dispose();
            } catch (pmremErr) {
                this.chromeCubeMap = cubeTexture;
            }
        } catch (e) {
            console.warn('Environment map warning:', e);
        }
    }

    buildCabinet3D() {
        // Material de paredes interiores blanco marfil suave de estudio (idéntico a la foto real)
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xf5f6f8,
            roughness: 0.75,
            metalness: 0.02
        });

        // Suelo interior blanco limpio de estudio fotográfico
        const floorGeo = new THREE.PlaneGeometry(13, 10);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xf0f2f5,
            roughness: 0.65,
            metalness: 0.04
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
        // RAMPA Y DEPÓSITO DE PREMIOS 3D LIMPIO Y ELEGANTE
        // ----------------------------------------------------
        const chuteGroup = new THREE.Group();
        chuteGroup.position.set(-4.5, -2.6, 1.8);

        // 1. Tolva principal exterior blanca suave
        const chuteBodyGeo = new THREE.BoxGeometry(2.7, 3.2, 3.4);
        const chuteBodyMat = new THREE.MeshStandardMaterial({
            color: 0xeef1f5,
            roughness: 0.45,
            metalness: 0.08
        });
        const chuteBody = new THREE.Mesh(chuteBodyGeo, chuteBodyMat);
        chuteBody.position.y = -0.6;
        chuteBody.receiveShadow = true;
        chuteGroup.add(chuteBody);

        // 2. Marco superior en rosa pastel suave
        const rimGeo = new THREE.BoxGeometry(2.8, 0.16, 3.5);
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0xf4c2ce,
            roughness: 0.35,
            metalness: 0.12
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.position.y = 1.05;
        chuteGroup.add(rim);

        // 3. Orificio/embudo interior profundo
        const holeGeo = new THREE.BoxGeometry(2.3, 0.12, 2.9);
        const holeMat = new THREE.MeshBasicMaterial({ color: 0x1a1e24 });
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.y = 0.98;
        chuteGroup.add(hole);

        // 4. Luz suave interior en la tolva
        const chuteLight = new THREE.PointLight(0xffffff, 0.8, 4.5);
        chuteLight.position.set(0, 0.4, 0);
        chuteGroup.add(chuteLight);

        this.scene.add(chuteGroup);

        // 5. Separador Acrílico Ultra-Transparente Limpio
        const acrylicGeo = new THREE.BoxGeometry(0.10, 3.6, 6.5);
        const acrylicMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.22,
            roughness: 0.04,
            transmission: 0.98
        });
        const acrylic = new THREE.Mesh(acrylicGeo, acrylicMat);
        acrylic.position.set(-3.1, -2.8, 1.2);
        this.scene.add(acrylic);

        // Barandilla superior de aluminio plateado satinado
        const railGeo = new THREE.CylinderGeometry(0.05, 0.05, 6.5, 16);
        const railMat = new THREE.MeshStandardMaterial({
            color: 0xd8e0e8,
            roughness: 0.15,
            metalness: 0.92,
            envMap: this.chromeCubeMap
        });
        const acrylicRail = new THREE.Mesh(railGeo, railMat);
        acrylicRail.rotation.x = Math.PI / 2;
        acrylicRail.position.set(-3.1, -0.95, 1.2);
        this.scene.add(acrylicRail);

        // ----------------------------------------------------
        // ENTORNO DEL MUEBLE REAL: TECHO Y POSTES ESQUINEROS ESTRUCTURALES
        // ----------------------------------------------------
        // 7. Techo interior blanco puro
        const ceilingGeo = new THREE.PlaneGeometry(13, 10);
        const ceilingMat = new THREE.MeshStandardMaterial({
            color: 0xfafbfc,
            roughness: 0.75,
            metalness: 0.02
        });
        const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 5.0;
        this.scene.add(ceiling);

        // 8. Cuatro Postes Esquineros de Aluminio Plata Satinado Elegante
        const postGeo = new THREE.BoxGeometry(0.28, 9.8, 0.28);
        const cornerPostMat = new THREE.MeshStandardMaterial({
            color: 0xdce2ea,
            metalness: 0.88,
            roughness: 0.12,
            envMap: this.chromeCubeMap,
            envMapIntensity: 1.2
        });

        // Poste Frontal Izquierdo
        const postFL = new THREE.Mesh(postGeo, cornerPostMat);
        postFL.position.set(-6.32, 0.1, 4.8);
        this.scene.add(postFL);

        // Poste Frontal Derecho
        const postFR = new THREE.Mesh(postGeo, cornerPostMat);
        postFR.position.set(6.32, 0.1, 4.8);
        this.scene.add(postFR);

        // Poste Trasero Izquierdo
        const postBL = new THREE.Mesh(postGeo, cornerPostMat);
        postBL.position.set(-6.32, 0.1, -4.8);
        this.scene.add(postBL);

        // Poste Trasero Derecho
        const postBR = new THREE.Mesh(postGeo, cornerPostMat);
        postBR.position.set(6.32, 0.1, -4.8);
        this.scene.add(postBR);

        // 9. Dintel Superior y Alféizar en Rosa Pastel a Juego con el Mueble
        const pastelTrimMat = new THREE.MeshStandardMaterial({
            color: 0xf4c2ce,
            roughness: 0.45,
            metalness: 0.08
        });

        const headerGeo = new THREE.BoxGeometry(12.9, 0.35, 0.35);
        const headerMesh = new THREE.Mesh(headerGeo, pastelTrimMat);
        headerMesh.position.set(0, 4.85, 4.8);
        this.scene.add(headerMesh);

        const sillGeo = new THREE.BoxGeometry(12.9, 0.28, 0.35);
        const sillMesh = new THREE.Mesh(sillGeo, pastelTrimMat);
        sillMesh.position.set(0, -4.7, 4.8);
        this.scene.add(sillMesh);

        // 10. Sombra de alineación en tiempo real en el suelo de premios (Ejes X y Z)
        const shadowGeo = new THREE.RingGeometry(0.12, 0.72, 32);
        const shadowMat = new THREE.MeshBasicMaterial({
            color: 0x64748b,
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide
        });
        this.alignmentShadow = new THREE.Mesh(shadowGeo, shadowMat);
        this.alignmentShadow.rotation.x = -Math.PI / 2;
        this.alignmentShadow.position.set(this.clawPos.x, -4.72, this.clawPos.z);
        this.scene.add(this.alignmentShadow);
    }

    buildCraneAndClaw3D() {
        // Materiales de Grado Industrial - 100% Acero Plateado y Cromo Espejo Auténtico de Arcade
        const silverSteelMat = new THREE.MeshStandardMaterial({
            color: 0x8a9dae,              // Tono plata / acero satinado auténtico (NO blanco, NO plástico)
            metalness: 0.94,              // Metal puro 94%
            roughness: 0.08,              // Reflejo pulido limpio
            envMap: this.chromeCubeMap,
            envMapIntensity: 1.2
        });

        const silverChromeMat = new THREE.MeshStandardMaterial({
            color: 0xa8b8c8,              // Cromo plateado brillante para ejes, pernos y herrajes
            metalness: 0.96,
            roughness: 0.04,
            envMap: this.chromeCubeMap,
            envMapIntensity: 1.3
        });

        const silverBoltMat = new THREE.MeshStandardMaterial({
            color: 0xc0d0e0,              // Pernos y pasadores de articulación
            metalness: 0.98,
            roughness: 0.03,
            envMap: this.chromeCubeMap,
            envMapIntensity: 1.4
        });

        const darkSteelMat = new THREE.MeshStandardMaterial({
            color: 0x1e242b,              // Retenes y bujes de acero templado
            metalness: 0.88,
            roughness: 0.25
        });

        const coiledCableMat = new THREE.MeshStandardMaterial({
            color: 0x111315,              // Cable espiral negro mate vulcanizado estilo teléfono
            roughness: 0.65,
            metalness: 0.12
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
        const linkGeo = new THREE.TorusGeometry(0.065, 0.018, 10, 18);
        linkGeo.scale(1.0, 1.45, 1.0);

        this.maxChainLinks = 44;
        this.chainMesh = new THREE.InstancedMesh(linkGeo, silverChromeMat, this.maxChainLinks);
        this.chainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.chainMesh.castShadow = true;
        this.scene.add(this.chainMesh);

        // 5. CABLE ESPIRAL NEGRO REALISTA (Tipo teléfono / muelle helicoidal que se estira y contrae)
        const spiralCurve = new SpiralCableCurve(0.12, 11, 1.0);
        const spiralGeo = new THREE.TubeGeometry(spiralCurve, 72, 0.024, 8, false);
        this.coiledCableMesh = new THREE.Mesh(spiralGeo, coiledCableMat);
        this.coiledCableMesh.castShadow = true;
        this.scene.add(this.coiledCableMesh);

        // 6. CABEZA DE LA GARRA METÁLICA DE PLATA REALISTA (IDÉNTICA A FOTO REAL DEL USUARIO)
        this.clawHead = new THREE.Group();
        this.clawHead.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);
        this.scene.add(this.clawHead);

        // Anilla giratoria superior de suspensión (Swivel)
        const swivelGeo = new THREE.TorusGeometry(0.16, 0.04, 16, 24);
        const swivelMesh = new THREE.Mesh(swivelGeo, silverChromeMat);
        swivelMesh.position.set(0, 1.18, 0);
        this.clawHead.add(swivelMesh);

        // Pasador transversal superior
        const swivelPin = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 16), silverBoltMat);
        swivelPin.rotation.x = Math.PI / 2;
        swivelPin.position.set(0, 1.02, 0);
        this.clawHead.add(swivelPin);

        // Tapa superior del solenoide con boquilla de cable espiral
        const topCapGeo = new THREE.CylinderGeometry(0.40, 0.44, 0.22, 32);
        const topCap = new THREE.Mesh(topCapGeo, silverChromeMat);
        topCap.position.y = 0.88;
        this.clawHead.add(topCap);

        // Conector de entrada para el cable espiral negro
        const cableInlet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16), darkSteelMat);
        cableInlet.position.set(0.35, 0.88, -0.12);
        this.clawHead.add(cableInlet);

        // Cilindro principal del solenoide (Carcasa mecanizada en acero plateado)
        const casingGeo = new THREE.CylinderGeometry(0.44, 0.44, 1.05, 32);
        const casing = new THREE.Mesh(casingGeo, silverSteelMat);
        casing.position.y = 0.32;
        this.clawHead.add(casing);

        // Anillos y ranuras mecanizados decorativos de alta fidelidad
        [-0.05, 0.32, 0.65].forEach(yPos => {
            const groove = new THREE.Mesh(new THREE.TorusGeometry(0.444, 0.022, 12, 32), silverChromeMat);
            groove.rotation.x = Math.PI / 2;
            groove.position.y = yPos;
            this.clawHead.add(groove);
        });

        // Brida inferior de montaje del cuerpo
        const baseFlangeGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.16, 32);
        const baseFlange = new THREE.Mesh(baseFlangeGeo, silverChromeMat);
        baseFlange.position.y = -0.28;
        this.clawHead.add(baseFlange);

        // Eje central cromado (Plunger Rod)
        const shaftGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.35, 20);
        const shaftMesh = new THREE.Mesh(shaftGeo, silverChromeMat);
        shaftMesh.position.y = -0.75;
        this.clawHead.add(shaftMesh);

        // Puntera redondeada inferior del eje central
        const shaftTip = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), silverChromeMat);
        shaftTip.position.y = -1.42;
        this.clawHead.add(shaftTip);

        // Buje / Collar actuador central deslizante (se mueve en Y mecánicamente con clawAngle)
        this.actuatorCollar = new THREE.Group();
        const collarRing = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.20, 24), silverSteelMat);
        this.actuatorCollar.add(collarRing);
        const collarRim = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.03, 12, 24), silverBoltMat);
        collarRim.rotation.x = Math.PI / 2;
        this.actuatorCollar.add(collarRim);
        this.actuatorCollar.position.y = -0.65;
        this.clawHead.add(this.actuatorCollar);

        // 7. TRES TENAZAS MECÁNICAS ARTICULADAS DE ACERO PLATEADO (120° entre sí)
        const prongCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.00,  0.00, 0.0), // Codo de articulación
            new THREE.Vector3(0.14, -0.42, 0.0), // Descenso curvado
            new THREE.Vector3(0.22, -0.92, 0.0), // Amplitud exterior máxima
            new THREE.Vector3(0.14, -1.42, 0.0), // Curva hacia adentro
            new THREE.Vector3(-0.08, -1.85, 0.0), // Inflexión hacia el centro
            new THREE.Vector3(-0.35, -2.05, 0.0)  // Punta redondeada hacia el centro
        ]);
        const prongGeo = new THREE.TubeGeometry(prongCurve, 32, 0.068, 12, false);

        this.prongs = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const prongGroup = new THREE.Group();
            prongGroup.rotation.y = angle;

            // Horquilla superior en la brida
            const mountBracket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.22), silverSteelMat);
            mountBracket.position.set(0.46, -0.28, 0);
            prongGroup.add(mountBracket);

            // Brazo diagonal superior (Strut fijo)
            const strutGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.48, 12);
            const upperStrut = new THREE.Mesh(strutGeo, silverSteelMat);
            upperStrut.position.set(0.56, -0.50, 0);
            upperStrut.rotation.z = -0.42;
            prongGroup.add(upperStrut);

            // Pivote principal del codo y tenaza
            const upperPivot = new THREE.Group();
            upperPivot.position.set(0.66, -0.68, 0);

            // Perno de articulación del codo
            const elbowPin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 16), silverBoltMat);
            elbowPin.rotation.x = Math.PI / 2;
            upperPivot.add(elbowPin);

            // Brazo tensor hacia el collar central
            const linkArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.08), silverSteelMat);
            linkArm.position.set(-0.16, 0.02, 0);
            upperPivot.add(linkArm);

            // Tenaza de acero curvada pulida
            const fingerMesh = new THREE.Mesh(prongGeo, silverSteelMat);
            fingerMesh.castShadow = true;
            upperPivot.add(fingerMesh);

            // Puntera redondeada suave en el extremo (Spoon tip)
            const tipCap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), silverChromeMat);
            tipCap.position.set(-0.35, -2.05, 0.0);
            upperPivot.add(tipCap);

            prongGroup.add(upperPivot);
            this.clawHead.add(prongGroup);

            this.prongs.push({ upperPivot });
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
                    mesh = createKawaiiPlushieMesh(proto, radius);
                    mesh.position.set(x, posY, z);
                    mesh.rotation.y = Math.random() * Math.PI * 2;
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
                        mesh = createKawaiiPlushieMesh(proto, radius);
                        mesh.position.set(x, posY, z);
                        mesh.rotation.y = Math.random() * Math.PI * 2;
                        mesh.rotation.z = (Math.random() - 0.5) * 0.22;
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

        // Botón ASOMARSE (Cámara de Inspección)
        const btnPeep = document.getElementById('btnPeepCamera');
        if (btnPeep) {
            btnPeep.addEventListener('click', () => this.togglePeepMode());
        }

        // Teclado con Flechas (↑, ↓, ←, →) y WASD para movimiento tridimensional completo
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.moveX = -1;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.moveX = 1;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.moveZ = -1; // Hacia el fondo
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.moveZ = 1;  // Hacia adelante

            if (e.code === 'KeyC' || e.code === 'KeyV') {
                this.togglePeepMode();
            }

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

    togglePeepMode() {
        this.isPeepMode = !this.isPeepMode;
        const btn = document.getElementById('btnPeepCamera');
        const toast = document.getElementById('peepModeToast');
        if (btn) btn.classList.toggle('active', this.isPeepMode);
        if (toast) toast.classList.toggle('show', this.isPeepMode);
        if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
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
        if (this.isPeepMode) {
            this.togglePeepMode(); // Desactivar modo asomarse al soltar la garra
        }
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
            const finalX = this.moveX || (this.moveLeft ? -1 : (this.moveRight ? 1 : 0));
            const finalZ = this.moveZ;

            if (this.isPeepMode) {
                // Modo Asomarse: El joystick mueve e introduce la cámara hacia el cristal
                const pSpeed = 0.085;
                if (finalX !== 0) {
                    this.camOffsetX = Math.max(-4.2, Math.min(4.2, this.camOffsetX + finalX * pSpeed));
                }
                if (finalZ !== 0) {
                    // Mover hacia adelante (stick negativo o W) acerca la cámara al interior
                    this.camOffsetZ = Math.max(-1.0, Math.min(5.2, this.camOffsetZ - finalZ * pSpeed));
                }
            } else {
                if (finalX !== 0) {
                    this.clawPos.x = Math.max(-2.2, Math.min(5.0, this.clawPos.x + finalX * speed));
                    if (window.soundFX && Math.random() < 0.15) window.soundFX.playMotor();
                }
                if (finalZ !== 0) {
                    this.clawPos.z = Math.max(-3.5, Math.min(3.5, this.clawPos.z + finalZ * speed));
                    if (window.soundFX && Math.random() < 0.15) window.soundFX.playMotor();
                }
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
                this.displaceNeighborPlushies();
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

            // Agarre imperfecto y resbalón arcade a media altura
            if (this.grabbedPlushie && this.prizePhysics.willSlip && this.clawPos.y >= this.prizePhysics.slipDropY) {
                const slipPrize = this.grabbedPlushie;
                this.prizePhysics.targetSquish = 0;
                this.fallingPrize = {
                    prize: slipPrize,
                    mesh: slipPrize.mesh,
                    velY: -0.04,
                    velX: (Math.random() - 0.5) * 0.02,
                    velZ: (Math.random() - 0.5) * 0.02,
                    rotVelX: (Math.random() - 0.5) * 0.08,
                    rotVelY: (Math.random() - 0.5) * 0.08,
                    rotVelZ: (Math.random() - 0.5) * 0.08,
                    isSlip: true,
                    floorY: slipPrize.initialY || -4.32
                };
                this.grabbedPlushie = null;
                this.clawAngle = 0.28; // Las tenazas se abren levemente por el resbalón
                if (window.soundFX) window.soundFX.playClawGrab();
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
            } else {
                this.clawPos.x = this.chutePos.x;
                this.clawPos.z = this.chutePos.z;
                this.state = 'RELEASING';
                this.releaseTimer = 0;
                this.targetClawAngle = 1.0; // Inicia la apertura de las tenazas sobre el depósito

                // Inercia de frenada brusca en la tolva ("¡Casi se cae!")
                if (this.grabbedPlushie) {
                    this.prizePhysics.dipVelY = -0.065; // Deslizamiento hacia abajo
                    this.prizePhysics.swayVelX -= 0.045; // Balanceo frontal hacia el depósito
                }
            }
        }

        // 6. Apertura de la garra y desprendimiento físico del producto (Free-fall)
        if (this.state === 'RELEASING') {
            this.releaseTimer++;
            this.targetClawAngle = 1.0;

            // Cuando las tenazas se abren mecánicamente (clawAngle > 0.32), el producto se desprende por gravedad
            if (this.grabbedPlushie && this.clawAngle > 0.32 && !this.fallingPrize) {
                const pp = this.prizePhysics;
                pp.targetSquish = 0;
                this.fallingPrize = {
                    prize: this.grabbedPlushie,
                    mesh: this.grabbedPlushie.mesh,
                    velY: -0.02 + pp.dipVelY,
                    velX: (pp.swayVelX * 0.65) + (Math.random() - 0.5) * 0.01,
                    velZ: (pp.swayVelZ * 0.65) + (Math.random() - 0.5) * 0.01,
                    rotVelX: (pp.swayVelZ * 0.45) + (Math.random() - 0.5) * 0.03,
                    rotVelY: (Math.random() - 0.5) * 0.03,
                    rotVelZ: (-pp.swayVelX * 0.45) + (Math.random() - 0.5) * 0.03
                };
                this.grabbedPlushie = null;
                if (window.soundFX) window.soundFX.playClawGrab();
            }

            // Si la garra llegó vacía al depósito y pasaron ~1s
            if (!this.grabbedPlushie && !this.fallingPrize && this.releaseTimer > 65) {
                this.onMissed3D();
                this.state = this.credits > 0 ? 'READY' : 'WAITING_COIN';
                this.targetClawAngle = 0.15;
            }
        }

        // 7. Simulación física de caída libre con gravedad acelerada (El producto cae de verdad)
        if (this.fallingPrize) {
            const fp = this.fallingPrize;
            fp.velY -= 0.016; // Gravedad acelerada natural (9.8 m/s²)
            fp.mesh.position.y += fp.velY;
            fp.mesh.position.x += fp.velX;
            fp.mesh.position.z += fp.velZ;
            fp.mesh.rotation.x += fp.rotVelX;
            fp.mesh.rotation.y += fp.rotVelY;
            fp.mesh.rotation.z += fp.rotVelZ;

            // Restaurar elasticidad hacia escala original (1, 1, 1)
            if (Math.abs(fp.mesh.scale.x - 1) > 0.005) {
                fp.mesh.scale.x += (1 - fp.mesh.scale.x) * 0.22;
                fp.mesh.scale.y += (1 - fp.mesh.scale.y) * 0.22;
                fp.mesh.scale.z += (1 - fp.mesh.scale.z) * 0.22;
            }

            if (fp.isSlip) {
                // El producto resbaló y cae de vuelta sobre la pila sin desaparecer
                if (fp.mesh.position.y <= fp.floorY) {
                    if (Math.abs(fp.velY) > 0.035) {
                        fp.velY = -fp.velY * 0.35; // Rebote amortiguado
                        fp.mesh.position.y = fp.floorY;
                    } else {
                        fp.mesh.position.y = fp.floorY;
                        fp.mesh.scale.set(1, 1, 1);
                        this.fallingPrize = null;
                    }
                }
            } else {
                // El producto cae a través del brocal (Y = -1.55) hasta sumergirse en el depósito (Y <= -4.8)
                if (fp.mesh.position.y <= -4.8) {
                    const wonPrize = fp.prize;
                    this.scene.remove(fp.mesh);
                    // Remover únicamente el premio ganado; todos los demás productos permanecen intactos
                    const pIndex = this.plushies.indexOf(wonPrize);
                    if (pIndex !== -1) {
                        this.plushies.splice(pIndex, 1);
                    }
                    this.fallingPrize = null;
                    this.onPrizeLandedInChute(wonPrize);
                }
            }
        }

        // 1. Cinemática de apertura/cierre de tenazas de acero plateado y desplazamiento del collar actuador
        this.clawAngle += (this.targetClawAngle - this.clawAngle) * 0.14;

        this.prongs.forEach(prong => {
            const angleZ = (this.clawAngle * 0.65) - 0.22;
            prong.upperPivot.rotation.z = angleZ;
        });

        if (this.actuatorCollar) {
            this.actuatorCollar.position.y = -0.65 - (this.clawAngle * 0.40);
        }

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

        // Físicas dinámicas del producto atrapado (inercia, balanceo, vibraciones y rebote)
        this.updateGrabbedPrizePhysics(accelX, accelZ);

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

        // Actualizar el Cable Espiral Negro tipo teléfono en 3D (se estira y contrae dinámicamente)
        if (this.coiledCableMesh) {
            const cableTopY = 4.8;
            const cableBottomY = this.clawPos.y + 0.88;
            const cableSpan = Math.max(0.15, cableTopY - cableBottomY);
            this.coiledCableMesh.position.set(this.clawPos.x + 0.35, cableTopY, this.clawPos.z - 0.12);
            this.coiledCableMesh.scale.set(1, cableSpan, 1);
        }

        // Actualizar sombra de alineación en tiempo real (Depth & Alignment Projection)
        if (this.alignmentShadow) {
            this.alignmentShadow.position.x = this.clawPos.x;
            this.alignmentShadow.position.z = this.clawPos.z;
            const depthFactor = Math.max(0, Math.min(1, (3.3 - this.clawPos.y) / 4.9));
            const shadowScale = 1.0 - (depthFactor * 0.35);
            this.alignmentShadow.scale.set(shadowScale, shadowScale, shadowScale);
            this.alignmentShadow.material.opacity = 0.26 + (depthFactor * 0.26);
        }

        // Posicionamiento de cámara 3D con modo Asomarse (Peep Mode) y parallax de profundidad
        if (!this.isPeepMode) {
            this.camOffsetX += (0 - this.camOffsetX) * 0.12;
            this.camOffsetZ += (0 - this.camOffsetZ) * 0.12;
        }
        const baseCamX = (this.clawPos.x * 0.15);
        const baseCamY = 0.8 + (this.clawPos.z * 0.1);
        const baseCamZ = 12.2;
        this.camera.position.x = baseCamX + this.camOffsetX;
        this.camera.position.y = baseCamY + (this.camOffsetZ * 0.08);
        this.camera.position.z = baseCamZ - this.camOffsetZ;
        this.camera.lookAt(this.camOffsetX * 0.35, -0.6, 0);
    }

    /**
     * Físicas orgánicas del producto dentro de la garra:
     * Balanceo pendular armónico con inercia propia, micro-vibraciones de motor y cadena,
     * asentamiento elástico al agarrar e inclinación asimétrica natural.
     */
    updateGrabbedPrizePhysics(accelX, accelZ) {
        if (!this.grabbedPlushie) return;

        const pp = this.prizePhysics;
        const mesh = this.grabbedPlushie.mesh;

        // 1. Resorte elástico de asentamiento al agarrar (Bounce & Settle)
        pp.bounceVelY += (-pp.bounceY * 0.24);
        pp.bounceVelY *= 0.82;
        pp.bounceY += pp.bounceVelY;

        // 2. Deslizamiento por desaceleración inercial (Dip & Catch al frenar en el depósito)
        pp.dipVelY += (-pp.dipY * 0.20);
        pp.dipVelY *= 0.86;
        pp.dipY += pp.dipVelY;

        // 3. Balanceo pendular armónico con inercia propia dentro de las tenazas
        // El producto siente la aceleración del carro más el acoplamiento elástico con la garra
        pp.swayVelX += -accelX * 0.52 - pp.swayX * 0.08 + (this.swayX - pp.swayX) * 0.14;
        pp.swayVelZ += -accelZ * 0.52 - pp.swayZ * 0.08 + (this.swayZ - pp.swayZ) * 0.14;
        pp.swayVelX *= 0.93;
        pp.swayVelZ *= 0.93;
        pp.swayX += pp.swayVelX;
        pp.swayZ += pp.swayVelZ;

        // Suavizado hacia la inclinación asimétrica natural de agarre
        pp.tiltX += (pp.targetTiltX - pp.tiltX) * 0.08;
        pp.tiltZ += (pp.targetTiltZ - pp.tiltZ) * 0.08;

        // 4. Micro-vibraciones mecánicas de motor, rieles y tensión de cadena
        let motorJitter = 0;
        if (this.state === 'LIFTING' || this.state === 'RETURNING') {
            motorJitter = Math.sin(Date.now() * 0.045) * 0.007;
        }

        // 5. Aplicar posición física en el espacio 3D
        mesh.position.x = this.clawPos.x + (pp.swayX * 0.38);
        mesh.position.y = this.clawPos.y - 1.65 + pp.bounceY + pp.dipY + motorJitter;
        mesh.position.z = this.clawPos.z + (pp.swayZ * 0.38);

        // 6. Aplicar rotación física inercial (inclinación orgánica + balanceo dinámico)
        mesh.rotation.x = pp.tiltX - (pp.swayZ * 0.75);
        mesh.rotation.z = pp.tiltZ + (pp.swayX * 0.75);
        mesh.rotation.y = pp.targetYaw + (pp.swayX * pp.swayZ * 0.4);

        // 7. Deformación elástica al atrapar (Squish / Soft-body)
        pp.squish += (pp.targetSquish - pp.squish) * 0.12;
        mesh.scale.set(
            1.0 - pp.squish * 0.85,
            1.0 + pp.squish * 1.15,
            1.0 - pp.squish * 0.85
        );
    }

    /**
     * Empuje e interacción con productos vecinos en la montaña (Pile Displacement).
     * Las tenazas abiertas desplazan y reacomodan radialmente los productos colindantes.
     */
    displaceNeighborPlushies() {
        const radiusLimit = 1.45;
        this.plushies.forEach(p => {
            if (p === this.grabbedPlushie) return;
            const dx = p.mesh.position.x - this.clawPos.x;
            const dz = p.mesh.position.z - this.clawPos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < radiusLimit && dist > 0.04) {
                const push = (radiusLimit - dist) * 0.12;
                p.mesh.position.x += (dx / dist) * push;
                p.mesh.position.z += (dz / dist) * push;
                p.mesh.rotation.y += (Math.random() - 0.5) * 0.18;
                p.mesh.rotation.z = Math.max(-0.25, Math.min(0.25, p.mesh.rotation.z + (Math.random() - 0.5) * 0.12));
            }
        });
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
            const dx = this.clawPos.x - closest.mesh.position.x;
            const dz = this.clawPos.z - closest.mesh.position.z;
            const grabOffset = Math.hypot(dx, dz);

            // Agarre imperfecto arcade (resbalón si la garra agarró por el borde descentrado)
            this.prizePhysics.willSlip = grabOffset > 0.44;
            this.prizePhysics.slipDropY = -0.5 + Math.random() * 1.8;
            this.prizePhysics.squish = 0;
            this.prizePhysics.targetSquish = 0.088; // Compresión elástica de ~9%

            // Inicializar físicas orgánicas del producto dentro de la garra
            this.prizePhysics.targetTiltX = (Math.random() - 0.5) * 0.26; // Inclinación asimétrica de ~8-15°
            this.prizePhysics.targetTiltZ = (Math.random() - 0.5) * 0.26;
            this.prizePhysics.targetYaw = Math.random() * Math.PI * 2;
            this.prizePhysics.tiltX = 0;
            this.prizePhysics.tiltZ = 0;
            this.prizePhysics.swayX = 0;
            this.prizePhysics.swayZ = 0;
            this.prizePhysics.swayVelX = 0;
            this.prizePhysics.swayVelZ = 0;
            this.prizePhysics.bounceY = -0.28; // Inicio comprimido hacia abajo
            this.prizePhysics.bounceVelY = 0.075; // Rebote elástico hacia arriba
            this.prizePhysics.dipY = 0;
            this.prizePhysics.dipVelY = 0;
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

    onPrizeLandedInChute(prize) {
        if (window.soundFX) window.soundFX.playWin();

        // Mostrar notificación de premio en pantalla
        this.showWinBanner(prize);

        // Iluminar la compuerta exterior de entrega de premios
        const prizeDoor = document.getElementById('prizeDispenserDoor');
        if (prizeDoor) {
            prizeDoor.classList.add('glow-win');
            setTimeout(() => prizeDoor.classList.remove('glow-win'), 3800);
        }

        // Transición de regreso una vez celebrado el aterrizaje del premio en el dispensador
        setTimeout(() => {
            this.state = this.credits > 0 ? 'READY' : 'WAITING_COIN';
            this.targetClawAngle = 0.15; // Regresa al reposo relajado
            // Los demás productos permanecen fijos e intactos en sus posiciones en la vitrina.
            // Solo se reponen si la vitrina se queda prácticamente vacía (menos de 4 premios).
            if (this.plushies.length < 4) {
                this.spawnPlushieMountain3D();
            }
        }, 1400);
    }

    onWinPrize3D(prize) {
        this.onPrizeLandedInChute(prize);
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
