import Game from '../../core/Game.js';
import { playChimeSound } from '../../utils/audio.js';

class Chime {
    constructor(x, y, length, width, freq) {
        this.originX = x;
        this.originY = y;
        this.length = length;
        this.width = width;
        this.freq = freq;
        
        this.angle = 0;
        this.aVelocity = 0;
        this.aAcceleration = 0;

        this.damping = 0.985;
        this.gravity = 0.4;
    }

    applyForce(force) {
        this.aVelocity += force;
    }

    update() {
        this.aAcceleration = (-this.gravity / this.length) * Math.sin(this.angle);
        this.aVelocity += this.aAcceleration;
        this.aVelocity *= this.damping;
        this.angle += this.aVelocity;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.originX, this.originY);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.length * 0.2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'rgba(180, 190, 200, 0.8)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;

        const startY = this.length * 0.2;
        const cylLength = this.length * 0.8;
 
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, startY, this.width, cylLength, this.width / 2);
        ctx.fill();
        ctx.stroke();
 
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(-this.width / 4, startY + 5, 2, cylLength - 10);
        
        ctx.restore();
    }
}

export default class WindChimes extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.chimes = [];
        this.mouse = { x: 0, y: 0, isDown: false, vx: 0 };
        this.lastMouse = { x: 0, y: 0 };
        
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'chimes-canvas';
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
            this.initChimes();
        }, 10);
    }

    initChimes() {
        this.chimes = [];
        const numChimes = 7;
        const spacing = Math.min(100, this.canvas.width / (numChimes + 1));
        const startX = (this.canvas.width - (spacing * (numChimes - 1))) / 2;

        const frequencies = [392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

        for (let i = 0; i < numChimes; i++) {
            const length = 200 + Math.random() * 150;
            this.chimes.push(new Chime(startX + (i * spacing), 20, length, 16, frequencies[i]));
        }
    }

    setupInteractions() {
        this.canvas.addEventListener('pointerdown', (e) => {
            this.mouse.isDown = true;
            this.updateMousePos(e);
            this.lastMouse = { x: this.mouse.x, y: this.mouse.y };
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (this.mouse.isDown) {
                this.updateMousePos(e);
                this.mouse.vx = this.mouse.x - this.lastMouse.x;

                this.chimes.forEach((chime) => {
                    const currentTipX = chime.originX + Math.sin(chime.angle) * chime.length;
                    const currentTipY = chime.originY + Math.cos(chime.angle) * chime.length;

                    if (Math.abs(this.mouse.x - currentTipX) < 40 && Math.abs(this.mouse.y - currentTipY) < chime.length) {
                        chime.applyForce((this.mouse.vx * 0.001) / (chime.length * 0.01));
                        if (Math.abs(this.mouse.vx) > 2) {
                            playChimeSound(chime.freq, Math.abs(this.mouse.vx) * 0.1);
                        }
                    }
                });

                this.lastMouse = { x: this.mouse.x, y: this.mouse.y };
            }
        });

        window.addEventListener('pointerup', () => {
            this.mouse.isDown = false;
        });
    }

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    update() {
        if (Math.random() < 0.01) {
            const windForce = (Math.random() - 0.5) * 0.02;
            this.chimes.forEach(chime => chime.applyForce(windForce));
        }

        this.chimes.forEach(chime => chime.update());

        for (let i = 0; i < this.chimes.length - 1; i++) {
            const c1 = this.chimes[i];
            const c2 = this.chimes[i+1];
            
            const tip1X = c1.originX + Math.sin(c1.angle) * c1.length;
            const tip2X = c2.originX + Math.sin(c2.angle) * c2.length;

            if (Math.abs(tip1X - tip2X) < c1.width) {
                const tempV = c1.aVelocity;
                c1.aVelocity = c2.aVelocity * 0.8;
                c2.aVelocity = tempV * 0.8;

                const impact = Math.abs(c1.aVelocity - c2.aVelocity);
                if (impact > 0.005) {
                    playChimeSound(c1.freq, impact * 10);
                    playChimeSound(c2.freq, impact * 10);
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#2a2d35';
        this.ctx.fillRect(50, 10, this.canvas.width - 100, 20);

        this.chimes.forEach(chime => chime.draw(this.ctx));
    }
}