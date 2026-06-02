class Hub {
    constructor() {
        this.grid = document.getElementById('game-grid');
        this.init();
    }

    init() {
        this.grid.addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');

            if (!card) return; 

            if (card.classList.contains('locked')) {
                console.log('This module is currently locked.');
                return;
            }

            const gameId = card.dataset.game;
            this.launchGame(gameId);
        });
    }

    launchGame(gameId) {
        console.log(`Transitioning to module: ${gameId}...`);
        alert(`Prepare to launch: ${gameId}! \n(UI transition coming soon)`);
        
    }
}

new Hub();