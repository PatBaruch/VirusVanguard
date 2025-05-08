import WizardsChest from './VirusVanguard.js';

const game: WizardsChest = new WizardsChest(document.getElementById('game') as HTMLCanvasElement);

window.addEventListener('load', () => {
  game.start();
});
