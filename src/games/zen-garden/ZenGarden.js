import Game from '../../core/Game.js';

export default class ZenGarden extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];

        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.initCanvas();
        window.addEventListener('resize', this.handleResize);
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

        const width = Math.min(rect.width, 1000);
        const height = Math.min(window.innerHeight * 0.7, 600);

        this.canvas.width = width;
        this.canvas.height = height;
    }

    update() {

    }

    draw() {
        this.ctx.fillStyle = 'rgba(26, 26, 36, 0.2)'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#7b7bb3';
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 50, 0, Math.PI * 2);
        this.ctx.fill();
    }
}