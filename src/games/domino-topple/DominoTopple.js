import Game from '../../core/Game.js';

class Domino {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.fallAngle = 0;
        this.state = 0; 
        this.hue = Math.random() * 60 + 180; 
    }

    update() {
        if (this.state === 1) {
            this.fallAngle += 0.15;
            if (this.fallAngle >= Math.PI / 2.2) {
                this.fallAngle = Math.PI / 2.2;
                this.state = 2; 
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.rotate(this.fallAngle);
        
        ctx.fillStyle = `hsl(${this.hue}, 70%, 50%)`;
        ctx.fillRect(-6, -30, 12, 60);
        
        ctx.strokeStyle = `hsl(${this.hue}, 80%, 70%)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(-6, -30, 12, 60);
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -15, 2, 0, Math.PI * 2);
        ctx.arc(0, 15, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

export default class DominoTopple extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.dominos = [];
        this.mouse = { x: 0, y: 0, isDown: false };
        this.lastPoint = null;
        this.spacing = 35;
        
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'domino-canvas';
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
        this.canvas.addEventListener('pointerdown', (e) => {
            this.updateMousePos(e);
            
            const clickedDomino = this.dominos.find(d => 
                Math.hypot(d.x - this.mouse.x, d.y - this.mouse.y) < 30
            );

            if (clickedDomino && clickedDomino.state === 0) {
                clickedDomino.state = 1;
            } else {
                this.mouse.isDown = true;
                this.dominos = []; 
                this.lastPoint = { x: this.mouse.x, y: this.mouse.y };
            }
        });

        this.canvas.addEventListener('pointermove', (e) => {
            if (this.mouse.isDown) {
                this.updateMousePos(e);
                
                const dist = Math.hypot(this.mouse.x - this.lastPoint.x, this.mouse.y - this.lastPoint.y);
                
                if (dist > this.spacing) {
                    const angle = Math.atan2(this.mouse.y - this.lastPoint.y, this.mouse.x - this.lastPoint.x);
                    this.dominos.push(new Domino(this.mouse.x, this.mouse.y, angle));
                    this.lastPoint = { x: this.mouse.x, y: this.mouse.y };
                }
            }
        });

        window.addEventListener('pointerup', () => {
            this.mouse.isDown = false;
            this.lastPoint = null;
        });
    }

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    update() {
        for (let i = 0; i < this.dominos.length; i++) {
            this.dominos[i].update();
            
            if (this.dominos[i].state === 1 && this.dominos[i].fallAngle > 0.6) {
                if (i < this.dominos.length - 1 && this.dominos[i + 1].state === 0) {
                    this.dominos[i + 1].state = 1;
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#1a1a24';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.dominos.length === 0) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.font = '24px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText("Draw a path, then click a domino.", this.canvas.width / 2, this.canvas.height / 2);
        }

        for (let i = 0; i < this.dominos.length; i++) {
            this.dominos[i].draw(this.ctx);
        }
    }
}