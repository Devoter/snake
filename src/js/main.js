import '../style/app.scss';
import Game from './game';

document.addEventListener('DOMContentLoaded', function () {
    let game = new Game();
    game.run();
});
