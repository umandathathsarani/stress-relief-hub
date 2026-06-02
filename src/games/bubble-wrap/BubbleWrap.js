import Game from '../../core/Game.js';

export default class BubbleWrap extends Game {
    constructor(containerId) {
        super(containerId); 
        this.poppedCount = 0;
        this.totalBubbles = 104;
    }

    start() {
        super.start(); 
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

        bubbleElement.classList.add('popped');
        this.poppedCount++;

        console.log(`Stress relieved: ${this.poppedCount} bubbles popped!`);
    }
}