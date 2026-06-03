import Game from '../../core/Game.js';
import { playBreatheCycle } from '../../utils/audio.js';

export default class BreathingOrb extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 4-7-8 Method constants (in frames at 60fps)
        this.INHALE_FRAMES = 4 * 60;
        this.HOLD_FRAMES = 7 * 60;
        this.EXHALE_FRAMES = 8 * 60;
        
        this.state = 'idle'; // idle, inhale, hold, exhale
        this.frameCounter = 0;
        
        this.minRadius = 50;
        this.maxRadius = 200;
        this.currentRadius = this.minRadius;
        
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'orb-canvas';
        this.resize();
        window.addEventListener('resize', this.handleResize);
        
        this.canvas.addEventListener('click', () => {
            if (this.state === 'idle') {
                this.startCycle();
            }
        });
    }

    stop() {
        super.stop();
        window.removeEventListener('resize', this.handleResize);
    }

    resize() {
        setTimeout(() => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width || (window.innerWidth * 0.8);
            this.canvas.height = rect.height || (window.innerHeight * 0.7);
            
            // Adjust max radius based on mobile screens
            this.maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
        }, 10);
    }

    startCycle() {
        this.state = 'inhale';
        this.frameCounter = 0;
        playBreatheCycle();
    }

    update() {
        if (this.state === 'idle') return;

        this.frameCounter++;

        if (this.state === 'inhale') {
            const progress = this.frameCounter / this.INHALE_FRAMES;
            // Smooth ease in/out
            const ease = 0.5 - Math.cos(progress * Math.PI) / 2; 
            this.currentRadius = this.minRadius + (this.maxRadius - this.minRadius) * ease;

            if (this.frameCounter >= this.INHALE_FRAMES) {
                this.state = 'hold';
                this.frameCounter = 0;
                this.currentRadius = this.maxRadius;
            }
        } 
        else if (this.state === 'hold') {
            if (this.frameCounter >= this.HOLD_FRAMES) {
                this.state = 'exhale';
                this.frameCounter = 0;
            }
        } 
        else if (this.state === 'exhale') {
            const progress = this.frameCounter / this.EXHALE_FRAMES;
            const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
            this.currentRadius = this.maxRadius - (this.maxRadius - this.minRadius) * ease;

            if (this.frameCounter >= this.EXHALE_FRAMES) {
                this.state = 'inhale'; // Loop back automatically
                this.frameCounter = 0;
                this.currentRadius = this.minRadius;
                playBreatheCycle(); // Trigger sound for next loop
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#0b0c10';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Draw glowing orb
        const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, this.currentRadius);
        gradient.addColorStop(0, 'rgba(102, 252, 241, 0.8)');
        gradient.addColorStop(0.5, 'rgba(69, 162, 158, 0.4)');
        gradient.addColorStop(1, 'rgba(31, 40, 51, 0)');

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, this.currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Text display
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        if (this.state === 'idle') {
            this.ctx.fillText("Click to begin 4-7-8 breathing", cx, cy);
        } else if (this.state === 'inhale') {
            this.ctx.fillText("Breathe In... (4s)", cx, cy);
        } else if (this.state === 'hold') {
            this.ctx.fillText("Hold... (7s)", cx, cy);
        } else if (this.state === 'exhale') {
            this.ctx.fillText("Breathe Out... (8s)", cx, cy);
        }
    }
}