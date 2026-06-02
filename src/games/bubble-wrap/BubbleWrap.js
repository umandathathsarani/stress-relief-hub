import Game from '../../core/Game.js';
import { playPopSound, playWinSound } from '../../utils/audio.js';
import { saveGameState, loadGameState, clearGameState } from '../../utils/storage.js'; 

export default class BubbleWrap extends Game {
    constructor(containerId) {
        super(containerId); 
        this.poppedCount = 0;
        this.totalBubbles = 104; 
        this.poppedIndices = []; 
    }

    start() {
        super.start();

        const savedState = loadGameState('bubble-wrap');

        if (savedState && savedState.length > 0 && savedState.length < this.totalBubbles) {
            this.promptResume(savedState);
        } else {
            this.initFreshGame();
        }
    }

    initFreshGame() {
        this.poppedCount = 0;
        this.poppedIndices = [];
        clearGameState('bubble-wrap');
        this.renderBubbles();
    }

    resumeGame(savedState) {
        this.poppedCount = savedState.length;
        this.poppedIndices = savedState;
        this.renderBubbles(true); 
    }

    promptResume(savedState) {
        this.container.innerHTML = ''; 
        
        const modal = document.createElement('div');
        modal.className = 'resume-modal win-message';
        modal.innerHTML = `
            <h2>Resume Session?</h2>
            <p>You have a bubble wrap session in progress.</p>
            <div class="modal-actions">
                <button id="btn-resume" class="btn-primary">Resume</button>
                <button id="btn-restart" class="back-btn">Start Over</button>
            </div>
        `;
        
        this.container.appendChild(modal);

        document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame(savedState));
        document.getElementById('btn-restart').addEventListener('click', () => this.initFreshGame());
    }

    renderBubbles(isResuming = false) {
        this.container.innerHTML = ''; 
        this.container.className = 'bubble-wrap-grid'; 
        
        for (let i = 0; i < this.totalBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            bubble.dataset.index = i;
            if (isResuming && this.poppedIndices.includes(i)) {
                bubble.classList.add('popped');
            }

            bubble.addEventListener('click', (e) => this.popBubble(e.target));
            this.container.appendChild(bubble);
        }
    }

    popBubble(bubbleElement) {
        if (bubbleElement.classList.contains('popped')) return;

        playPopSound();
        bubbleElement.classList.add('popped');
        
        this.poppedCount++;
        this.poppedIndices.push(parseInt(bubbleElement.dataset.index));

        saveGameState('bubble-wrap', this.poppedIndices);
        
        if (this.poppedCount === this.totalBubbles) {
            this.triggerWinState();
            clearGameState('bubble-wrap');
        }
    }

    triggerWinState() {
        playWinSound();
        confetti({ particleCount: 100, spread: 70, origin: { x: 0, y: 0.6 } });
        confetti({ particleCount: 100, spread: 70, origin: { x: 1, y: 0.6 } });

        const message = document.createElement('div');
        message.className = 'win-message';
        message.innerHTML = `
            <h2>All Cleared! ✨</h2>
            <p>Take a deep breath and relax.</p>
        `;
        this.container.appendChild(message);
    }
}