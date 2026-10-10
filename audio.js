/**
 * audio.js - Motor de Sonido Fotorrealista de Máquina Recreativa Arcade
 * Diseñado con Web Audio API de alta fidelidad:
 * - Modelado físico y acústico de monedas mecánicas reales (impacto, resonancia modal de latón/níquel y campana de crédito arcade)
 * - Servomotores paso a paso (stepper motors) continuos en X/Z y fricción en rieles de acero con cojinetes
 * - Cabrestante de cable de acero con tambor giratorio y engranaje rítmico
 * - Solenoide electromagnético de alta potencia con golpe sordo ("THUMP") y choque resonante de 3 tenazas de acero
 * - Apertura y desprendimiento mecánico en el depósito
 * - Aterrizaje amortiguado del premio en la tolva dispensadora con sonido de compuerta
 * - Fanfarria de victoria polifónica estilo arcade japonés (UFO Catcher) con síntesis FM cristalina
 * - Resbalón orgánico de premio con fricción de tenazas de acero y caída sorda
 * - Clics táctiles de microswitches mecánicos (botones arcade tipo Sanwa/Happ)
 * - Sonido de servo electrónico para la cámara de inspección ("Asomarse")
 * - Música ambiental arcade opcional (Attract Mode BGM) con control de silencio
 * - Cero dependencias externas ni archivos remotos; 100% autónomo y de latencia cero.
 */

class SoundFX {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.limiter = null;
        this.cabinetFilter = null;
        this.muted = false;
        this.isMotorRunning = false;
        this.motorNodes = null;
        this.bgmPlaying = false;
        this.bgmInterval = null;

        // Recuperar preferencia de silencio si existe
        try {
            const savedMute = localStorage.getItem('arcade_sound_muted');
            if (savedMute !== null) {
                this.muted = (savedMute === 'true');
            }
        } catch (e) {}
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            // Limitador / Compresor de seguridad (evita saturación y clipeo)
            this.limiter = this.ctx.createDynamicsCompressor();
            this.limiter.threshold.setValueAtTime(-4.0, this.ctx.currentTime);
            this.limiter.knee.setValueAtTime(10.0, this.ctx.currentTime);
            this.limiter.ratio.setValueAtTime(8.0, this.ctx.currentTime);
            this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
            this.limiter.release.setValueAtTime(0.15, this.ctx.currentTime);

            // Filtro acústico de cabina de cristal/madera (calidez interior arcade)
            this.cabinetFilter = this.ctx.createBiquadFilter();
            this.cabinetFilter.type = 'lowpass';
            this.cabinetFilter.frequency.setValueAtTime(11500, this.ctx.currentTime);
            this.cabinetFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

            // Control de volumen maestro
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.muted ? 0.0 : 0.85, this.ctx.currentTime);

            // Conectar cadena de audio maestra
            this.cabinetFilter.connect(this.limiter);
            this.limiter.connect(this.masterGain);
            this.masterGain.connect(this.ctx.destination);
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        try {
            localStorage.setItem('arcade_sound_muted', this.muted);
        } catch (e) {}

        if (this.masterGain && this.ctx) {
            const now = this.ctx.currentTime;
            if (this.masterGain.gain.cancelScheduledValues) {
                this.masterGain.gain.cancelScheduledValues(now);
            }
            this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0.0 : 0.85, now + 0.05);
        }

        if (this.muted && this.bgmPlaying) {
            this.stopBGM();
        }

        return this.muted;
    }

    /**
     * Generador de ruido blanco normalizado para fricción, impactos y aire
     */
    createNoiseBuffer(durationSec = 0.5) {
        if (!this.ctx) return null;
        const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * (1 - (i / bufferSize) * 0.4);
        }
        return buffer;
    }

    // =========================================================================
    // 1. INSERCIÓN DE MONEDA REALISTA (Mecanismo, Impacto de Latón y Campana)
    // =========================================================================
    playCoin() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // A. Clic mecánico de entrada del monedero (Microswitch de ranura)
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(3600, now);
        clickOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.025);
        clickGain.gain.setValueAtTime(0.22, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        clickOsc.connect(clickGain);
        clickGain.connect(this.cabinetFilter);
        clickOsc.start(now);
        clickOsc.stop(now + 0.03);

        // B. Resonancia modal de token metálico cayendo por la rampa de latón
        const coinFrequencies = [3180, 4650, 6120, 7840];
        coinFrequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + 0.03);

            const initialGain = 0.14 / (idx + 1);
            gain.gain.setValueAtTime(initialGain, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03 + (0.16 - idx * 0.02));

            osc.connect(gain);
            gain.connect(this.cabinetFilter);
            osc.start(now + 0.03);
            osc.stop(now + 0.22);
        });

        // C. Segundo rebote metálico en la guía
        const bounceOsc = this.ctx.createOscillator();
        const bounceGain = this.ctx.createGain();
        bounceOsc.type = 'sine';
        bounceOsc.frequency.setValueAtTime(3920, now + 0.085);
        bounceGain.gain.setValueAtTime(0.08, now + 0.085);
        bounceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        bounceOsc.connect(bounceGain);
        bounceGain.connect(this.cabinetFilter);
        bounceOsc.start(now + 0.085);
        bounceOsc.stop(now + 0.17);

        // D. Golpe sordo en la gaveta colectora inferior (Hollow metal cashbox thud)
        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(185, now + 0.15);
        thudOsc.frequency.exponentialRampToValueAtTime(55, now + 0.24);
        thudGain.gain.setValueAtTime(0.20, now + 0.15);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        thudOsc.connect(thudGain);
        thudGain.connect(this.cabinetFilter);
        thudOsc.start(now + 0.15);
        thudOsc.stop(now + 0.26);

        // E. Campana electrónica de crédito registrado (Chime FM brillante: B5 -> E6)
        const creditNotes = [
            { freq: 987.77, start: 0.22, dur: 0.10, vol: 0.20 },  // B5
            { freq: 1318.51, start: 0.31, dur: 0.45, vol: 0.26 }  // E6
        ];

        creditNotes.forEach(n => {
            const carrier = this.ctx.createOscillator();
            const modulator = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();
            const carrierGain = this.ctx.createGain();

            carrier.type = 'sine';
            carrier.frequency.setValueAtTime(n.freq, now + n.start);

            // Modulación FM para timbre cristalino de campana arcade
            modulator.type = 'sine';
            modulator.frequency.setValueAtTime(n.freq * 2.0, now + n.start);
            modGain.gain.setValueAtTime(n.freq * 0.8, now + n.start);
            modGain.gain.exponentialRampToValueAtTime(1.0, now + n.start + n.dur);

            modulator.connect(carrier.frequency);

            carrierGain.gain.setValueAtTime(n.vol, now + n.start);
            carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

            carrier.connect(carrierGain);
            carrierGain.connect(this.cabinetFilter);

            modulator.start(now + n.start);
            carrier.start(now + n.start);
            modulator.stop(now + n.start + n.dur);
            carrier.stop(now + n.start + n.dur);
        });
    }

    // =========================================================================
    // 2. SERVOMOTORES PASO A PASO CONTINUOS Y RIELES DE ACERO (X/Z Gantry)
    // =========================================================================
    startMotor() {
        if (this.muted || this.isMotorRunning) return;
        this.init();
        this.isMotorRunning = true;
        const now = this.ctx.currentTime;

        const motorGain = this.ctx.createGain();
        motorGain.gain.setValueAtTime(0.001, now);
        motorGain.gain.linearRampToValueAtTime(0.095, now + 0.045);

        // Zumbido eléctrico de motor paso a paso (NEMA Stepper dual harmonic)
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(228, now);

        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(456, now);

        const osc2Gain = this.ctx.createGain();
        osc2Gain.gain.setValueAtTime(0.35, now);
        osc2.connect(osc2Gain);

        // Fricción de rodamientos de bolas sobre riel de acero pulido (Bandpass noise)
        const noiseBuf = this.createNoiseBuffer(2.0);
        let noiseSource = null;
        let noiseGain = null;
        if (noiseBuf) {
            noiseSource = this.ctx.createBufferSource();
            noiseSource.buffer = noiseBuf;
            noiseSource.loop = true;

            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1250, now);
            noiseFilter.Q.setValueAtTime(2.8, now);

            noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.045, now);

            noiseSource.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(motorGain);
            noiseSource.start(now);
        }

        osc1.connect(motorGain);
        osc2Gain.connect(motorGain);
        motorGain.connect(this.cabinetFilter);

        osc1.start(now);
        osc2.start(now);

        this.motorNodes = { osc1, osc2, noiseSource, motorGain };
    }

    stopMotor() {
        if (!this.isMotorRunning || !this.motorNodes) return;
        this.isMotorRunning = false;
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const { osc1, osc2, noiseSource, motorGain } = this.motorNodes;

        if (motorGain.gain.cancelScheduledValues) {
            motorGain.gain.cancelScheduledValues(now);
        }
        motorGain.gain.setValueAtTime(motorGain.gain.value, now);
        motorGain.gain.linearRampToValueAtTime(0.0001, now + 0.055);

        setTimeout(() => {
            try {
                osc1.stop();
                osc2.stop();
                if (noiseSource) noiseSource.stop();
                motorGain.disconnect();
            } catch (e) {}
        }, 70);

        this.motorNodes = null;
    }

    /** Disparo corto para compatibilidad con código existente */
    playMotor() {
        if (this.muted) return;
        this.startMotor();
        setTimeout(() => this.stopMotor(), 110);
    }

    // =========================================================================
    // 3. CABRESTANTE Y POLEA DE CABLE DE ACERO (Descenso y Ascenso)
    // =========================================================================
    playCableDrop() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Motor acelerando en bajada: glissando descendente de tono
        const motorOsc = this.ctx.createOscillator();
        const motorGain = this.ctx.createGain();
        motorOsc.type = 'sawtooth';
        motorOsc.frequency.setValueAtTime(460, now);
        motorOsc.frequency.exponentialRampToValueAtTime(210, now + 0.38);

        motorGain.gain.setValueAtTime(0.11, now);
        motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.40);

        // Trémolo de rueda dentada del carrete de cable (rítmico "trrrrrr")
        const tremolo = this.ctx.createOscillator();
        const tremoloGain = this.ctx.createGain();
        tremolo.frequency.setValueAtTime(26, now);
        tremoloGain.gain.setValueAtTime(0.04, now);
        tremolo.connect(motorGain.gain);

        motorOsc.connect(motorGain);
        motorGain.connect(this.cabinetFilter);

        tremolo.start(now);
        motorOsc.start(now);
        tremolo.stop(now + 0.40);
        motorOsc.stop(now + 0.42);

        // Fricción de cable de acero deslizándose por la polea de nailon
        const noiseBuf = this.createNoiseBuffer(0.35);
        if (noiseBuf) {
            const noise = this.ctx.createBufferSource();
            noise.buffer = noiseBuf;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(2200, now);
            const ng = this.ctx.createGain();
            ng.gain.setValueAtTime(0.035, now);
            ng.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            noise.connect(filter);
            filter.connect(ng);
            ng.connect(this.cabinetFilter);
            noise.start(now);
        }
    }

    playCableLift() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Motor de elevación bajo esfuerzo de carga (tono sostenido con zumbido)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(295, now);
        osc.frequency.linearRampToValueAtTime(320, now + 0.35);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.40);

        osc.connect(gain);
        gain.connect(this.cabinetFilter);
        osc.start(now);
        osc.stop(now + 0.42);
    }

    // =========================================================================
    // 4. SOLENOIDE ELECTROIMÁN Y CHOQUE RESONANTE DE TENAZAS (Claw Grab)
    // =========================================================================
    playClawGrab() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // A. Golpe sordo y pesado del émbolo del solenoide electroimán (Magnetic Thump)
        const punchOsc = this.ctx.createOscillator();
        const punchGain = this.ctx.createGain();
        punchOsc.type = 'sine';
        punchOsc.frequency.setValueAtTime(95, now);
        punchOsc.frequency.exponentialRampToValueAtTime(28, now + 0.07);

        punchGain.gain.setValueAtTime(0.36, now);
        punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        punchOsc.connect(punchGain);
        punchGain.connect(this.cabinetFilter);
        punchOsc.start(now);
        punchOsc.stop(now + 0.09);

        // B. Transiente inicial de impacto metálico seco (Impact Snap)
        const snapOsc = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snapOsc.type = 'square';
        snapOsc.frequency.setValueAtTime(2100, now);
        snapOsc.frequency.exponentialRampToValueAtTime(380, now + 0.02);
        snapGain.gain.setValueAtTime(0.24, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        snapOsc.connect(snapGain);
        snapGain.connect(this.cabinetFilter);
        snapOsc.start(now);
        snapOsc.stop(now + 0.03);

        // C. Resonancia modal de las 3 tenazas de acero inoxidable curvadas (Steel Prongs Clang)
        // 3 tenazas chocando producen armónicos metálicos agudos y cristalinos
        const prongFrequencies = [1520, 2380, 3420, 4750];
        prongFrequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + 0.004);

            const amp = 0.16 / (idx * 0.7 + 1);
            gain.gain.setValueAtTime(amp, now + 0.004);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.004 + (0.34 - idx * 0.04));

            osc.connect(gain);
            gain.connect(this.cabinetFilter);
            osc.start(now + 0.004);
            osc.stop(now + 0.38);
        });

        // D. Reacomodo elástico del resorte de retorno
        const springOsc = this.ctx.createOscillator();
        const springGain = this.ctx.createGain();
        springOsc.type = 'sine';
        springOsc.frequency.setValueAtTime(1180, now + 0.065);
        springGain.gain.setValueAtTime(0.06, now + 0.065);
        springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        springOsc.connect(springGain);
        springGain.connect(this.cabinetFilter);
        springOsc.start(now + 0.065);
        springOsc.stop(now + 0.14);
    }

    // =========================================================================
    // 5. APERTURA Y DESPRENDIMIENTO MECÁNICO EN EL DEPÓSITO (Claw Release)
    // =========================================================================
    playClawRelease() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Clic-clack mecánico de distensión del resorte de la garra
        const relOsc = this.ctx.createOscillator();
        const relGain = this.ctx.createGain();
        relOsc.type = 'triangle';
        relOsc.frequency.setValueAtTime(1450, now);
        relOsc.frequency.exponentialRampToValueAtTime(580, now + 0.04);

        relGain.gain.setValueAtTime(0.18, now);
        relGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        relOsc.connect(relGain);
        relGain.connect(this.cabinetFilter);
        relOsc.start(now);
        relOsc.stop(now + 0.05);
    }

    // =========================================================================
    // 6. RECEPCIÓN ACOLCHADA DEL PREMIO EN LA TOLVA DISPENSADORA
    // =========================================================================
    playPrizeDropChute() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Golpe amortiguado del peluche/comida contra la bandeja de entrega
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        padOsc.type = 'sine';
        padOsc.frequency.setValueAtTime(110, now);
        padOsc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

        padGain.gain.setValueAtTime(0.28, now);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        padOsc.connect(padGain);
        padGain.connect(this.cabinetFilter);
        padOsc.start(now);
        padOsc.stop(now + 0.15);

        // Fricción de tela/acrílico del dispensador
        const noiseBuf = this.createNoiseBuffer(0.12);
        if (noiseBuf) {
            const noise = this.ctx.createBufferSource();
            noise.buffer = noiseBuf;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(480, now);
            const ng = this.ctx.createGain();
            ng.gain.setValueAtTime(0.08, now);
            ng.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            noise.connect(filter);
            filter.connect(ng);
            ng.connect(this.cabinetFilter);
            noise.start(now);
        }

        // Tintineo sutil de la compuerta abatible de premios
        const flapOsc = this.ctx.createOscillator();
        const flapGain = this.ctx.createGain();
        flapOsc.type = 'triangle';
        flapOsc.frequency.setValueAtTime(820, now + 0.07);
        flapGain.gain.setValueAtTime(0.06, now + 0.07);
        flapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        flapOsc.connect(flapGain);
        flapGain.connect(this.cabinetFilter);
        flapOsc.start(now + 0.07);
        flapOsc.stop(now + 0.16);
    }

    // =========================================================================
    // 7. RESBALÓN ARCADE POR AGARRE DESCENTRADO (Prize Slip)
    // =========================================================================
    playPrizeSlip() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Fricción rápida de metal resbalando sobre tela
        const slipOsc = this.ctx.createOscillator();
        const slipGain = this.ctx.createGain();
        slipOsc.type = 'sawtooth';
        slipOsc.frequency.setValueAtTime(1850, now);
        slipOsc.frequency.exponentialRampToValueAtTime(720, now + 0.09);

        slipGain.gain.setValueAtTime(0.14, now);
        slipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);

        slipOsc.connect(slipGain);
        slipGain.connect(this.cabinetFilter);
        slipOsc.start(now);
        slipOsc.stop(now + 0.11);

        // Caída y golpe de rebote sordo sobre la montaña de premios
        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(130, now + 0.22);
        thudOsc.frequency.exponentialRampToValueAtTime(50, now + 0.32);

        thudGain.gain.setValueAtTime(0.20, now + 0.22);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

        thudOsc.connect(thudGain);
        thudGain.connect(this.cabinetFilter);
        thudOsc.start(now + 0.22);
        thudOsc.stop(now + 0.35);
    }

    // =========================================================================
    // 8. FANFARRIA POLIFÓNICA ARCADE DE VICTORIA (UFO Catcher Win Fanfare)
    // =========================================================================
    playWin() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Secuencia polifónica arpegiada estilo arcade japonés de alta definición
        const melody = [
            // Arpegio ascendente ágil y brillante
            { freq: 523.25, time: 0.00, dur: 0.10, vol: 0.22 }, // C5
            { freq: 659.25, time: 0.09, dur: 0.10, vol: 0.24 }, // E5
            { freq: 783.99, time: 0.18, dur: 0.10, vol: 0.26 }, // G5
            { freq: 1046.50, time: 0.27, dur: 0.12, vol: 0.28 }, // C6
            { freq: 1318.51, time: 0.38, dur: 0.22, vol: 0.30 }, // E6
            { freq: 1174.66, time: 0.52, dur: 0.14, vol: 0.26 }, // D6
            { freq: 1567.98, time: 0.66, dur: 0.70, vol: 0.32 }  // G6 (Gran nota final triunfal)
        ];

        // Acordes de acompañamiento festivo (campanas FM ricas en armónicos)
        const chords = [
            // Acorde C Major sostenido
            { freq: 523.25, time: 0.38, dur: 0.95, vol: 0.18 }, // C5
            { freq: 659.25, time: 0.38, dur: 0.95, vol: 0.18 }, // E5
            { freq: 1046.50, time: 0.66, dur: 0.85, vol: 0.20 } // C6
        ];

        // Reproducir notas melódicas principales con síntesis FM
        melody.forEach(n => {
            const carrier = this.ctx.createOscillator();
            const modulator = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();
            const noteGain = this.ctx.createGain();

            carrier.type = 'triangle';
            carrier.frequency.setValueAtTime(n.freq, now + n.time);

            modulator.type = 'sine';
            modulator.frequency.setValueAtTime(n.freq * 2.0, now + n.time);
            modGain.gain.setValueAtTime(n.freq * 0.9, now + n.time);
            modGain.gain.exponentialRampToValueAtTime(1.0, now + n.time + n.dur);

            modulator.connect(carrier.frequency);

            noteGain.gain.setValueAtTime(n.vol, now + n.time);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

            carrier.connect(noteGain);
            noteGain.connect(this.cabinetFilter);

            modulator.start(now + n.time);
            carrier.start(now + n.time);
            modulator.stop(now + n.time + n.dur);
            carrier.stop(now + n.time + n.dur);
        });

        // Reproducir acordes armónicos de fondo
        chords.forEach(c => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(c.freq, now + c.time);

            gain.gain.setValueAtTime(c.vol, now + c.time);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + c.time + c.dur);

            osc.connect(gain);
            gain.connect(this.cabinetFilter);
            osc.start(now + c.time);
            osc.stop(now + c.time + c.dur);
        });
    }

    // =========================================================================
    // 9. JINGLE MELANCÓLICO DE INTENTO FALLIDO (Arcade Miss)
    // =========================================================================
    playMiss() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        const missNotes = [
            { freq: 440.00, time: 0.00, dur: 0.16 }, // A4
            { freq: 392.00, time: 0.17, dur: 0.16 }, // G4
            { freq: 349.23, time: 0.34, dur: 0.18 }, // F4
            { freq: 293.66, time: 0.52, dur: 0.45 }  // D4
        ];

        missNotes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(n.freq, now + n.time);

            gain.gain.setValueAtTime(0.12, now + n.time);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

            osc.connect(gain);
            gain.connect(this.cabinetFilter);
            osc.start(now + n.time);
            osc.stop(now + n.time + n.dur);
        });
    }

    // =========================================================================
    // 10. CLIC TÁCTIL DE BOTÓN ARCADE MICROSWITCH (Sanwa Button Click)
    // =========================================================================
    playButtonClick() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Clic nítido de émbolo plástico de botón domo
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(2800, now);
        clickOsc.frequency.exponentialRampToValueAtTime(650, now + 0.02);

        clickGain.gain.setValueAtTime(0.18, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        clickOsc.connect(clickGain);
        clickGain.connect(this.cabinetFilter);
        clickOsc.start(now);
        clickOsc.stop(now + 0.03);

        // Rebote interno del microswitch (Cherry / Omron snap)
        const snapOsc = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snapOsc.type = 'sine';
        snapOsc.frequency.setValueAtTime(1420, now + 0.012);
        snapGain.gain.setValueAtTime(0.10, now + 0.012);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        snapOsc.connect(snapGain);
        snapGain.connect(this.cabinetFilter);
        snapOsc.start(now + 0.012);
        snapOsc.stop(now + 0.04);
    }

    // =========================================================================
    // 11. SONIDO DE CÁMARA DE INSPECCIÓN ("Asomarse")
    // =========================================================================
    playPeepCamera() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Tono electrónico futurista de dos notas agudas (servo chirp)
        const tones = [
            { freq: 1760, time: 0.00, dur: 0.05 }, // A6
            { freq: 2349, time: 0.06, dur: 0.09 }  // D7
        ];

        tones.forEach(t => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(t.freq, now + t.time);

            gain.gain.setValueAtTime(0.14, now + t.time);
            gain.gain.exponentialRampToValueAtTime(0.001, now + t.time + t.dur);

            osc.connect(gain);
            gain.connect(this.cabinetFilter);
            osc.start(now + t.time);
            osc.stop(now + t.time + t.dur);
        });
    }

    // =========================================================================
    // 12. MÚSICA AMBIENTAL KAWAII OPCIONAL (Attract Mode BGM)
    // =========================================================================
    startBGM() {
        if (this.muted || this.bgmPlaying) return;
        this.init();
        this.bgmPlaying = true;

        // Loop melódico alegre y sutil estilo marimba / FM bells (volumen ambiente muy bajo: 0.032)
        const bgmNotes = [
            { note: 523.25, dur: 0.18 }, // C5
            { note: 659.25, dur: 0.18 }, // E5
            { note: 783.99, dur: 0.18 }, // G5
            { note: 659.25, dur: 0.18 }, // E5
            { note: 880.00, dur: 0.18 }, // A5
            { note: 783.99, dur: 0.18 }, // G5
            { note: 659.25, dur: 0.18 }, // E5
            { note: 587.33, dur: 0.18 }  // D5
        ];

        let noteIdx = 0;
        this.bgmInterval = setInterval(() => {
            if (!this.bgmPlaying || this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const n = bgmNotes[noteIdx % bgmNotes.length];
            noteIdx++;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.note, now);

            gain.gain.setValueAtTime(0.032, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.dur);

            osc.connect(gain);
            gain.connect(this.cabinetFilter);
            osc.start(now);
            osc.stop(now + n.dur);
        }, 220);
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }

    toggleBGM() {
        if (this.bgmPlaying) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.bgmPlaying;
    }
}

window.soundFX = new SoundFX();
