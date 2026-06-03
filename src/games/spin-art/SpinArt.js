import Game from '../../core/Game.js';
import { playSplatSound } from '../../utils/audio.js';

export default class SpinArt extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.artCanvas = document.createElement('canvas');
        this.artCtx = this.artCanvas.getContext('2d');
        
        this.mouse = { x: 0, y: 0, isDown: false };
        this.hue = Math.random() * 360;
        this.angle = 0;
        this.soundTimer = 0;
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'spin-canvas';
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
            
            const oldImg = this.artCtx.getImageData(0, 0, this.artCanvas.width || 1, this.artCanvas.height || 1);
            
            this.artCanvas.width = this.canvas.width;
            this.artCanvas.height = this.canvas.height;
            
            if (oldImg.width > 1) {
                this.artCtx.putImageData(oldImg, 0, 0);
            }
        }, 10);
    }

    setupInteractions() {
        this.canvas.addEventListener('pointerdown', (e) => {
            this.mouse.isDown = true;
            this.hue = Math.random() * 360;
            this.updateMousePos(e);
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (this.mouse.isDown) {
                this.updateMousePos(e);
            }
        });

        window.addEventListener('pointerup', () => {
            this.mouse.isDown = false;
        });
    }

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);
        const mouseAngle = Math.atan2(dy, dx);
        
        this.mouse.x = cx + Math.cos(mouseAngle - this.angle) * dist;
        this.mouse.y = cy + Math.sin(mouseAngle - this.angle) * dist;
    }

    update() {
        this.angle += 0.05;
        
        if (this.mouse.isDown) {
            this.soundTimer++;
            if (this.soundTimer % 8 === 0) {
                playSplatSound();
            }

            this.artCtx.beginPath();
            this.artCtx.arc(this.mouse.x, this.mouse.y, Math.random() * 10 + 5, 0, Math.PI * 2);
            this.artCtx.fillStyle = `hsl(${this.hue}, 80%, 60%)`;
            this.artCtx.fill();
            
            for(let i = 0; i < 4; i++) {
                const sx = this.mouse.x + (Math.random() - 0.5) * 40;
                const sy = this.mouse.y + (Math.random() - 0.5) * 40;
                this.artCtx.beginPath();
                this.artCtx.arc(sx, sy, Math.random() * 3, 0, Math.PI * 2);
                this.artCtx.fill();
            }
            this.hue += 0.5;
        }
    }

    draw() {
        this.ctx.fillStyle = '#1a1a24';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        
        this.ctx.drawImage(this.artCanvas, 0, 0);
        
        this.ctx.restore();
    }
}