import '../style/app.scss';
import Game from './game';
import levels from './levels';

document.addEventListener('DOMContentLoaded', function () {
    let game = new Game(levels);
    game.run();
});
