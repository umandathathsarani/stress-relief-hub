import Game from '../../core/Game.js';
import { playSliceSound } from '../../utils/audio.js';

class Target {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * (canvasWidth - 100) + 50;
        this.y = canvasHeight + 50;
        this.radius = Math.random() * 20 + 30;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = -(Math.random() * 3 + 5);
        this.gravity = 0.05;
        this.sliced = false;
        this.hue = Math.floor(Math.random() * 360);
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(ctx) {
        if (this.sliced) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
        ctx.fill();
    }
}

export default class ZenSlicer extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.targets = [];
        this.mouse = { x: 0, y: 0, isDown: false, path: [] };
        this.handleResize = this.resize.bind(this);
        this.spawnTimer = 0;
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'slicer-canvas';
        this.resize();
        window.addEventListener('resize', this.handleResize);
        this.setupInteractions();
    }

    stop() {
        super.stop();
        window.removeEventListener('resize', this.handleResize);
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = Math.min(rect.width, 1000);
        this.canvas.height = Math.min(window.innerHeight * 0.7, 600);
    }

    setupInteractions() {
        this.canvas.addEventListener('pointerdown', (e) => {
            this.mouse.isDown = true;
            this.mouse.path = [];
            this.updateMousePos(e);
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (this.mouse.isDown) {
                this.updateMousePos(e);
                this.mouse.path.push({ x: this.mouse.x, y: this.mouse.y });
                if (this.mouse.path.length > 10) {
                    this.mouse.path.shift();
                }
                this.checkCollisions();
            }
        });

        window.addEventListener('pointerup', () => {
            this.mouse.isDown = false;
            this.mouse.path = [];
        });
    }

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    checkCollisions() {
        if (this.mouse.path.length < 2) return;
        const p1 = this.mouse.path[this.mouse.path.length - 2];
        const p2 = this.mouse.path[this.mouse.path.length - 1];

        this.targets.forEach(target => {
            if (target.sliced) return;
            const dist = Math.hypot(target.x - p2.x, target.y - p2.y);
            if (dist < target.radius) {
                target.sliced = true;
                playSliceSound();
            }
        });
    }

    update() {
        this.spawnTimer++;
        if (this.spawnTimer % 60 === 0) {
            this.targets.push(new Target(this.canvas.width, this.canvas.height));
        }

        for (let i = this.targets.length - 1; i >= 0; i--) {
            this.targets[i].update();
            if (this.targets[i].y > this.canvas.height + 100 || this.targets[i].sliced) {
                this.targets.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#1a1a24';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.targets.forEach(target => target.draw(this.ctx));

        if (this.mouse.isDown && this.mouse.path.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouse.path[0].x, this.mouse.path[0].y);
            for (let i = 1; i < this.mouse.path.length; i++) {
                this.ctx.lineTo(this.mouse.path[i].x, this.mouse.path[i].y);
            }
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 4;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.stroke();
        }
    }
}