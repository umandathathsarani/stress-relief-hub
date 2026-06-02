import BubbleWrap from '../games/bubble-wrap/BubbleWrap.js';
import ZenGarden from '../games/zen-garden/ZenGarden.js';

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
            window.location.hash = gameId;
        });

        this.backBtn.addEventListener('click', () => {
            window.location.hash = '';
        });

        window.addEventListener('hashchange', () => this.handleRouting());

        this.handleRouting();
    }

    handleRouting() {
        const hash = window.location.hash.replace('#', '');
        
        if (hash) {
            this.launchGame(hash);
        } else {
            this.returnToHub();
        }
    }

    launchGame(gameId) {
        if (this.activeGameInstance) return; 

        this.grid.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');

        if (gameId === 'bubble-wrap') {
            this.activeGameInstance = new BubbleWrap('active-game');
            this.activeGameInstance.start();
        } else if (gameId === 'zen-garden') {
            this.activeGameInstance = new ZenGarden('active-game');
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