import Game from '../../core/Game.js';
import { playSingingBowl } from '../../utils/audio.js';

export default class Harmonograph extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.isDrawing = false;
        this.t = 0;
        
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'harmonograph-canvas';
        this.resize();
        window.addEventListener('resize', this.handleResize);
        
        this.canvas.addEventListener('click', () => {
            this.generateParams();
            playSingingBowl();
        });

        setTimeout(() => {
            this.generateParams();
            playSingingBowl();
        }, 300);
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
  
            this.ctx.fillStyle = '#0d0d12';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }, 10);
    }

    generateParams() {
        this.t = 0;

        this.f1 = Math.random() * 3 + 1.01;
        this.f2 = Math.random() * 3 + 1.01;
        this.f3 = Math.random() * 3 + 1.01;
        this.f4 = Math.random() * 3 + 1.01;

        this.p1 = Math.random() * Math.PI * 2;
        this.p2 = Math.random() * Math.PI * 2;
        this.p3 = Math.random() * Math.PI * 2;
        this.p4 = Math.random() * Math.PI * 2;

        this.d1 = Math.random() * 0.001 + 0.0001;
        this.d2 = Math.random() * 0.001 + 0.0001;
        this.d3 = Math.random() * 0.001 + 0.0001;
        this.d4 = Math.random() * 0.001 + 0.0001;
        
        this.hue = Math.random() * 360;

        this.ctx.fillStyle = '#0d0d12';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.lastX = this.calculateX(0);
        this.lastY = this.calculateY(0);
        
        this.isDrawing = true;
    }

    calculateX(time) {
        const amp = Math.min(this.canvas.width, this.canvas.height) * 0.22;
        return (this.canvas.width / 2) 
             + (amp * Math.sin(time * this.f1 + this.p1) * Math.exp(-this.d1 * time)) 
             + (amp * Math.sin(time * this.f2 + this.p2) * Math.exp(-this.d2 * time));
    }

    calculateY(time) {
        const amp = Math.min(this.canvas.width, this.canvas.height) * 0.22;
        return (this.canvas.height / 2) 
             + (amp * Math.sin(time * this.f3 + this.p3) * Math.exp(-this.d3 * time)) 
             + (amp * Math.sin(time * this.f4 + this.p4) * Math.exp(-this.d4 * time));
    }

    update() {
    }

    draw() {
        if (!this.isDrawing) {
            if (this.t > 1500) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.font = '20px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText("Click to generate a new pattern", this.canvas.width / 2, this.canvas.height - 30);
            }
            return;
        }

        for (let i = 0; i < 40; i++) {
            this.t += 0.06;
            
            const x = this.calculateX(this.t);
            const y = this.calculateY(this.t);
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);

            this.ctx.strokeStyle = `hsla(${this.hue + (this.t * 0.5)}, 70%, 60%, 0.5)`;
            this.ctx.lineWidth = 1.2;
            this.ctx.stroke();
            
            this.lastX = x;
            this.lastY = y;

            if (this.t > 1500) {
                this.isDrawing = false;
                break;
            }
        }
    }
}