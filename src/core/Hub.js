import BubbleWrap from '../games/bubble-wrap/BubbleWrap.js';

class Hub {
    constructor() {
        this.grid = document.getElementById('game-grid');
        this.gameContainer = document.getElementById('game-container');
        this.backBtn = document.getElementById('back-btn');
        this.activeGameInstance = null;
        
        this.init();
    }

    init() {
        this.grid.addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');
            if (!card || card.classList.contains('locked')) return; 

            const gameId = card.dataset.game;
            this.launchGame(gameId);
        });

        this.backBtn.addEventListener('click', () => this.returnToHub());
    }

    launchGame(gameId) {
        this.grid.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');

        if (gameId === 'bubble-wrap') {
            this.activeGameInstance = new BubbleWrap('active-game');
            this.activeGameInstance.start();
        }
    }

    returnToHub() {
        if (this.activeGameInstance) {
            this.activeGameInstance.stop();
            document.getElementById('active-game').innerHTML = '';
            this.activeGameInstance = null;
        }

        this.gameContainer.classList.add('hidden');
        this.grid.classList.remove('hidden');
    }
}

new Hub();