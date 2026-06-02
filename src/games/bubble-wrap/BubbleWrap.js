import Game from '../../core/Game.js';
import { playPopSound, playWinSound } from '../../utils/audio.js'; 

export default class BubbleWrap extends Game {
    constructor(containerId) {
        super(containerId); 
        this.poppedCount = 0;
        this.totalBubbles = 104; 
    }

    start() {
        super.start();
        this.poppedCount = 0; 
        this.renderBubbles();
    }

    renderBubbles() {
        this.container.innerHTML = ''; 
        this.container.className = 'bubble-wrap-grid'; 
        
        for (let i = 0; i < this.totalBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            bubble.addEventListener('click', (e) => this.popBubble(e.target));
            this.container.appendChild(bubble);
        }
    }

    popBubble(bubbleElement) {
        if (bubbleElement.classList.contains('popped')) return;

        playPopSound();
        bubbleElement.classList.add('popped');
        this.poppedCount++;

        if (this.poppedCount === this.totalBubbles) {
            this.triggerWinState();
        }
    }

    triggerWinState() {
        playWinSound();

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0, y: 0.6 }
        });

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 1, y: 0.6 } 
        });

        const message = document.createElement('div');
        message.className = 'win-message';
        message.innerHTML = `
            <h2>All Cleared! ✨</h2>
            <p>Take a deep breath and relax.</p>
        `;
        this.container.appendChild(message);
    }
}