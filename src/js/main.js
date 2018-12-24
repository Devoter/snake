import '../style/app.scss';
import Game from './game';
import cellRenderer from './cell-renderer';
import levels from './levels';
import config from './config';

document.addEventListener('DOMContentLoaded', function () {
    const game = new Game(config.host, config.port, config.nameMaxLength, levels);
    game.cellRenderer = cellRenderer;
    if (game.createFieldLayout())
        game.run(false, true);
    else
        console.log('Could not create a field layout.');
});
