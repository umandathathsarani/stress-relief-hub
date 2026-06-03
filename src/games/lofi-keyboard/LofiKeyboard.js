import Game from '../../core/Game.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default class LofiKeyboard extends Game {
    constructor(containerId) {
        super(containerId);
        this.audioCtx = new AudioContext();
        this.keys = [
            'Q','W','E','R','T','Y','U','I','O','P',
            'A','S','D','F','G','H','J','K','L',';',
            'Z','X','C','V','B','N','M',',','.','/'
        ];
        
        this.frequencies = this.keys.map((_, i) => 220 * Math.pow(Math.pow(2, 1/12), i));
        this.keyElements = {};
        
        this.handleKeyDown = this.onKeyDown.bind(this);
        this.handleKeyUp = this.onKeyUp.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'keyboard-container';
        
        this.keys.forEach((key, index) => {
            const btn = document.createElement('button');
            btn.className = 'key';
            btn.textContent = key;
            
            btn.addEventListener('pointerdown', () => this.playThock(index, btn));
            btn.addEventListener('pointerup', () => btn.classList.remove('pressed'));
            btn.addEventListener('pointerleave', () => btn.classList.remove('pressed'));
            
            this.keyElements[key.toLowerCase()] = btn;
            wrapper.appendChild(btn);
        });

        this.container.appendChild(wrapper);
        
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    stop() {
        super.stop();
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    onKeyDown(e) {
        if (e.repeat) return;
        const key = e.key.toLowerCase();
        if (this.keyElements[key]) {
            const index = this.keys.findIndex(k => k.toLowerCase() === key);
            this.playThock(index, this.keyElements[key]);
        }
    }

    onKeyUp(e) {
        const key = e.key.toLowerCase();
        if (this.keyElements[key]) {
            this.keyElements[key].classList.remove('pressed');
        }
    }

    playThock(index, btnElement) {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        
        btnElement.classList.add('pressed');

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.frequencies[index], this.audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.3);

        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.6, this.audioCtx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.6);
    }
}