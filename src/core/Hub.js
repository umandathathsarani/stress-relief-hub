import BubbleWrap from '../games/bubble-wrap/BubbleWrap.js';
import ZenGarden from '../games/zen-garden/ZenGarden.js';
import ZenSlicer from '../games/zen-slicer/ZenSlicer.js';
import KineticSand from '../games/kinetic-sand/KineticSand.js';
import DominoTopple from '../games/domino-topple/DominoTopple.js';
import SpinArt from '../games/spin-art/SpinArt.js';
import LofiKeyboard from '../games/lofi-keyboard/LofiKeyboard.js';
import WaterRipples from '../games/water-ripples/WaterRipples.js';
import BreathingOrb from '../games/breathing-orb/BreathingOrb.js';

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
        } else if (gameId === 'zen-garden') {
            this.activeGameInstance = new ZenGarden('active-game');
        } else if (gameId === 'zen-slicer') {
            this.activeGameInstance = new ZenSlicer('active-game');
        } else if (gameId === 'kinetic-sand') {
            this.activeGameInstance = new KineticSand('active-game');
        } else if (gameId === 'domino-topple') {
            this.activeGameInstance = new DominoTopple('active-game');
        } else if (gameId === 'spin-art') {
            this.activeGameInstance = new SpinArt('active-game');
        } else if (gameId === 'lofi-keyboard') {
            this.activeGameInstance = new LofiKeyboard('active-game');
        } else if (gameId === 'water-ripples') {
            this.activeGameInstance = new WaterRipples('active-game');
        } else if (gameId === 'breathing-orb') {
            this.activeGameInstance = new BreathingOrb('active-game');
        }

        if (this.activeGameInstance) {
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