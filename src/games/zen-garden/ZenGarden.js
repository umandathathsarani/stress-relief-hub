import Game from '../../core/Game.js';

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 2; 

        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1 - 0.5; 
        this.life = 1.0; 
        this.decay = Math.random() * 0.015 + 0.005; 
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.1; 
        
        const hues = [180, 220, 260];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
    }

    update() {
        this.angle += this.spin;

        this.x += this.speedX + Math.sin(this.angle) * 0.8;
        this.y += this.speedY;
        
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.life})`;
        ctx.shadowBlur = 15; // Increased glow
        ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, ${this.life})`;
        ctx.fill();
    }
}

export default class ZenGarden extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];

        this.mouse = { x: null, y: null, isDrawing: false };
        
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.initCanvas();
        window.addEventListener('resize', this.handleResize);

        this.setupInteractions();
    }

    stop() {
        super.stop();
        window.removeEventListener('resize', this.handleResize);
    }

    initCanvas() {
        this.container.innerHTML = ''; 
        this.container.appendChild(this.canvas);
        this.canvas.className = 'zen-canvas';
        this.resize();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = Math.min(rect.width, 1000);
        this.canvas.height = Math.min(window.innerHeight * 0.7, 600);
    }

    setupInteractions() {
        this.canvas.addEventListener('pointerdown', (e) => {
            this.mouse.isDrawing = true;
            this.updateMousePos(e);
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (this.mouse.isDrawing) {
                this.updateMousePos(e);
                for (let i = 0; i < 3; i++) {
                    this.particles.push(new Particle(this.mouse.x, this.mouse.y));
                }
            }
        });

        window.addEventListener('pointerup', () => {
            this.mouse.isDrawing = false;
        });
    }

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();

            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(26, 26, 36, 0.15)'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(this.ctx);
        }
    }
}