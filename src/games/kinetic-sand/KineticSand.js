import Game from '../../core/Game.js';
import { playSandSound } from '../../utils/audio.js';

export default class KineticSand extends Game {
    constructor(containerId) {
        super(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.gridSize = 6; 
        this.cols = 0;
        this.rows = 0;
        this.grid = [];
        this.hue = 200;
        this.soundTimer = 0;
        
        this.mouse = { x: 0, y: 0, isDown: false };
        this.handleResize = this.resize.bind(this);
    }

    start() {
        super.start();
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.canvas.className = 'sand-canvas';
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
            
            const newCols = Math.floor(this.canvas.width / this.gridSize);
            const newRows = Math.floor(this.canvas.height / this.gridSize);
            
            const newGrid = Array(newCols).fill().map(() => Array(newRows).fill(0));
            
            for (let i = 0; i < Math.min(this.cols, newCols); i++) {
                for (let j = 0; j < Math.min(this.rows, newRows); j++) {
                    newGrid[i][j] = this.grid[i] ? this.grid[i][j] : 0;
                }
            }
            
            this.cols = newCols;
            this.rows = newRows;
            this.grid = newGrid;
        }, 10);
    }

    setupInteractions() {
        this.canvas.addEventListener('pointerdown', (e) => {
            this.mouse.isDown = true;
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
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    update() {
        if (this.mouse.isDown) {
            this.soundTimer++;
            if (this.soundTimer % 5 === 0) {
                playSandSound();
            }

            const col = Math.floor(this.mouse.x / this.gridSize);
            const row = Math.floor(this.mouse.y / this.gridSize);
            const brush = 3;

            for (let i = -brush; i <= brush; i++) {
                for (let j = -brush; j <= brush; j++) {
                    if (Math.random() > 0.4) {
                        const c = col + i;
                        const r = row + j;
                        if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                            this.grid[c][r] = this.hue;
                        }
                    }
                }
            }
            this.hue += 0.5;
            if (this.hue > 360) this.hue = 0;
        }

        for (let y = this.rows - 2; y >= 0; y--) {
            const dir = Math.random() > 0.5 ? 1 : -1;
            
            for (let i = 0; i < this.cols; i++) {
                const x = dir === 1 ? i : this.cols - 1 - i;
                const state = this.grid[x][y];
                
                if (state > 0) {
                    const down = this.grid[x][y + 1] === 0;
                    const downLeft = x > 0 && this.grid[x - 1][y + 1] === 0;
                    const downRight = x < this.cols - 1 && this.grid[x + 1][y + 1] === 0;

                    if (down) {
                        this.grid[x][y + 1] = state;
                        this.grid[x][y] = 0;
                    } else if (downLeft && downRight) {
                        if (Math.random() > 0.5) {
                            this.grid[x - 1][y + 1] = state;
                            this.grid[x][y] = 0;
                        } else {
                            this.grid[x + 1][y + 1] = state;
                            this.grid[x][y] = 0;
                        }
                    } else if (downLeft) {
                        this.grid[x - 1][y + 1] = state;
                        this.grid[x][y] = 0;
                    } else if (downRight) {
                        this.grid[x + 1][y + 1] = state;
                        this.grid[x][y] = 0;
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#1a1a24';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.grid[i][j] > 0) {
                    this.ctx.fillStyle = `hsl(${this.grid[i][j]}, 80%, 60%)`;
                    this.ctx.fillRect(i * this.gridSize, j * this.gridSize, this.gridSize, this.gridSize);
                }
            }
        }
    }
}