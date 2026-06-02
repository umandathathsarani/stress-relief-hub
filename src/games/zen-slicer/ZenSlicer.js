import Game from '../../core/Game.js';
import { playSliceSound } from '../../utils/audio.js';

class Target {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * (canvasWidth - 100) + 50;
        this.y = canvasHeight + 50;
        this.radius = Math.random() * 20 + 30;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = -(Math.random() * 3 + 5);
        this.gravity = 0.1;
        this.sliced = false;
        this.hue = Math.floor(Math.random() * 360);
        
        this.half1 = { x: 0, y: 0, speedX: 0, speedY: 0, angle: 0 };
        this.half2 = { x: 0, y: 0, speedX: 0, speedY: 0, angle: 0 };
    }

    slice() {
        this.sliced = true;
        
        this.half1 = {
            x: this.x,
            y: this.y,
            speedX: this.speedX - 2,
            speedY: this.speedY - 1,
            angle: 0
        };
        
        this.half2 = {
            x: this.x,
            y: this.y,
            speedX: this.speedX + 2,
            speedY: this.speedY + 1,
            angle: 0
        };
    }

    update() {
        if (!this.sliced) {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
        } else {
            this.half1.speedY += this.gravity;
            this.half1.x += this.half1.speedX;
            this.half1.y += this.half1.speedY;
            this.half1.angle -= 0.05;

            this.half2.speedY += this.gravity;
            this.half2.x += this.half2.speedX;
            this.half2.y += this.half2.speedY;
            this.half2.angle += 0.05;
        }
    }

    draw(ctx) {
        if (!this.sliced) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
            ctx.fill();
        } else {
            ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;

            ctx.save();
            ctx.translate(this.half1.x, this.half1.y);
            ctx.rotate(this.half1.angle);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, Math.PI * 0.5, Math.PI * 1.5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.translate(this.half2.x, this.half2.y);
            ctx.rotate(this.half2.angle);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, Math.PI * 1.5, Math.PI * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
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
        const p2 = this.mouse.path[this.mouse.path.length - 1];

        this.targets.forEach(target => {
            if (target.sliced) return;
            const dist = Math.hypot(target.x - p2.x, target.y - p2.y);
            if (dist < target.radius) {
                target.slice();
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
            
            const target = this.targets[i];
            if (!target.sliced && target.y > this.canvas.height + 100) {
                this.targets.splice(i, 1);
            } else if (target.sliced && (target.half1.y > this.canvas.height + 100 && target.half2.y > this.canvas.height + 100)) {
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