import Game from '../../core/Game.js';
import { playNightSound } from '../../utils/audio.js';

class Firefly {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
        this.hue = Math.random() * 30 + 50; 
        this.angle = Math.random() * Math.PI * 2;
        this.glowOffset = Math.random() * Math.PI * 2;
    }

    update(mouseX, mouseY, isSwarming) {
        if (isSwarming && mouseX !== null && mouseY !== null) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist > 5) {
                this.vx += (dx / dist) * 0.05;
                this.vy += (dy / dist) * 0.05;
            }
        } else {
            this.angle += (Math.random() - 0.5) * 0.2;
            this.vx += Math.cos(this.angle) * 0.05;
            this.vy += Math.sin(this.angle) * 0.05;
        }

        const speed = Math.hypot(this.vx, this.vy);
        const maxSpeed = isSwarming ? 3.5 : 1.2;
        
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx, time) {
        const glow = (Math.sin(time * 0.05 + this.glowOffset) + 1) / 2;
        const alpha = 0.2 + glow * 0.8;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${alpha})`;
        ctx.shadowBlur = 12 * glow;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0; 
    }
}

export default class FireflyMeadow extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireflies = [];
        this.mouse = { x: null, y: null, isDown: false };
        this.time = 0;
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'firefly-canvas';
        this.resize();
        window.addEventListener('resize', this.handleResize);

        for (let i = 0; i < 150; i++) {
            this.fireflies.push(new Firefly(this.canvas.width || window.innerWidth * 0.8, this.canvas.height || window.innerHeight * 0.7));
        }

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
        this.canvas.addEventListener('pointerdown', (e) => {
            this.mouse.isDown = true;
            this.updateMousePos(e);
            playNightSound();
        });

        this.canvas.addEventListener('pointermove', (e) => {
            this.updateMousePos(e);
        });

        window.addEventListener('pointerup', () => {
            this.mouse.isDown = false;
        });
        
        this.canvas.addEventListener('pointerleave', () => {
            this.mouse.isDown = false;
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    update() {
        this.time++;
        this.fireflies.forEach(f => {
            f.update(this.mouse.x, this.mouse.y, this.mouse.isDown);
            
            if (f.x < 0) f.x = this.canvas.width;
            if (f.x > this.canvas.width) f.x = 0;
            if (f.y < 0) f.y = this.canvas.height;
            if (f.y > this.canvas.height) f.y = 0;
        });
    }

    draw() {
        this.ctx.fillStyle = '#050a14'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'lighter';
        this.fireflies.forEach(f => f.draw(this.ctx, this.time));
        this.ctx.globalCompositeOperation = 'source-over';

        if (!this.mouse.isDown && this.time < 300) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.font = '20px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText("Click and hold to gather the fireflies", this.canvas.width / 2, this.canvas.height - 40);
        }
    }
}