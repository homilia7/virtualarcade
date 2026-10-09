/**
 * audio.js - Motor de Sonido Sintetizado con Web Audio API
 * No requiere archivos externos de audio mp3/wav; genera ondas en tiempo real.
 */

class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // Sonido al insertar moneda / ticket
    playCoin() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
    }

    // Sonido de movimiento de motor / riel
    playMotor() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.05);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Sonido de la garra descendiendo / cable
    playCableDrop() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.3);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
    }

    // Sonido de las pinzas metálicas cerrándose (clack)
    playClawGrab() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);

        const clang = this.ctx.createOscillator();
        const clangGain = this.ctx.createGain();
        clang.type = 'sine';
        clang.frequency.setValueAtTime(1200, now + 0.02);
        clang.frequency.exponentialRampToValueAtTime(600, now + 0.25);
        clangGain.gain.setValueAtTime(0.15, now + 0.02);
        clangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        clang.connect(clangGain);
        clangGain.connect(this.ctx.destination);
        clang.start(now + 0.02);
        clang.stop(now + 0.25);
    }

    // Fanfarria de victoria / Premio obtenido
    playWin() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [
            { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
            { freq: 659.25, time: 0.13, dur: 0.12 }, // E5
            { freq: 783.99, time: 0.26, dur: 0.12 }, // G5
            { freq: 1046.50, time: 0.39, dur: 0.45 }  // C6
        ];

        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.freq, now + n.time);

            gain.gain.setValueAtTime(0.25, now + n.time);
            gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + n.time);
            osc.stop(now + n.time + n.dur);
        });
    }

    // Sonido si la garra se resbala / no atrapa
    playMiss() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
    }
}

window.soundFX = new SoundFX();
