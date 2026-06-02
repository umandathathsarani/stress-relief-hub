export default class Game {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.score = 0;
        this.animationFrameId = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loop();
        console.log('Game Engine: Started');
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        console.log('Game Engine: Stopped');
    }

    loop() {
        if (!this.isRunning) return;
        
        this.update(); 
        this.draw();  
        
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    update() {}

    draw() {}
}