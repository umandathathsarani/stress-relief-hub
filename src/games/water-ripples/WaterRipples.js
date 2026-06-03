import Game from '../../core/Game.js';
import { playRippleSound } from '../../utils/audio.js';

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = Math.random() * 80 + 60;
        this.speed = Math.random() * 1.5 + 1;
        this.opacity = 0.7;
    }

    update() {
        this.radius += this.speed;
        this.opacity -= 0.7 / (this.maxRadius / this.speed);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(130, 210, 255, ${Math.max(0, this.opacity)})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(130, 210, 255, ${Math.max(0, this.opacity * 0.5)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

export default class WaterRipples extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ripples = [];
        this.mouse = { x: 0, y: 0, isDown: false };
        this.handleResize = this.resize.bind(this);
        this.spawnTimer = 0;
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'ripple-canvas';
        this.resize();
        window.addEventListener('resize', this.handleResize);
        this.setupInteractions();
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
        }, 10);
    }

    setupInteractions() {
        const createRipple = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.ripples.push(new Ripple(x, y));
            playRippleSound();
        };

        this.canvas.addEventListener('pointerdown', (e) => {
            this.mouse.isDown = true;
            createRipple(e);
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (this.mouse.isDown) {
                this.spawnTimer++;
                if (this.spawnTimer % 15 === 0) {
                    createRipple(e);
                }
            }
        });

        window.addEventListener('pointerup', () => {
            this.mouse.isDown = false;
        });
    }

    update() {
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            this.ripples[i].update();
            if (this.ripples[i].opacity <= 0 || this.ripples[i].radius >= this.ripples[i].maxRadius) {
                this.ripples.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(11, 26, 42, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ripples.forEach(ripple => ripple.draw(this.ctx));
    }
}
