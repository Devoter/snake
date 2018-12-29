import Rabbit from './game-items/rabbit';
import Wall from './game-items/wall';
import Barrier from './game-items/barrier';
import Snake from './game-items/snake';
import Field from './field';
import Adapter from './adapter';

export default class Game {
    _field = null;
    _elements = null;
    _adapter = null;
    _sizeX = 0;
    _sizeY = 0;
    _snake = null;
    _input = [];
    _iterationTimer = null;
    _level = -1;
    _speed = 0;
    _speedFactor = 0;
    _score = 0;
    _levelScore = 0;
    _showHelp = false;
    _baseSpeed = 0;
    _baseSpeedIterationsCount = 0;
    _speedIterationsCount = 0;
    _shouldGenerateFood = 0;
    _foodLifeTime = 0;
    _foodFactor = 0;
    _rabbitsCount = 0;
    _pause = false;
    _inputQueueLimit = 0;
    _levels = null;
    _cellRenderer = null;
    _activePrerenderedCell = null;
    _inactivePrerenderedCell = null;
    _foodPrerenderedCell = null;
    _snakePrerenderedCell = null;
    _shouldRedrawDisplay = false;
    _animationTimer = null;
    _showScoreTable = false;
    _nameMaxLength = 0;
    _name = '';
    _nameFieldMode = false;
    _keyboard = [];
    _keyboardActive = null;
    _keyboardActiveIndex = -1;
    _availableKeys = [
        37, // ARROW LEFT
        38, // ARROW UP
        39, // ARROW RIGHT
        40, // ARROW DOWN
        65, // A
        87, // W
        68, // D
        83  // S
    ];

    constructor(host, port, nameMaxLength = 10, levels = null, sizeX = 10, sizeY = 20, baseSpeed = 300, speedFactor = 6,
                speedIterationsCount = 25, foodLifeTime = 25, foodFactor = 1, rabbitsCount = 1, inputQueueLimit = 4,
                cellRenderer = null) {
        this._field = new Field(sizeX, sizeY);
        this._elements = {
            display: document.getElementById('snake-display'),
            highScore: document.getElementById('high-score'),
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            speed: document.getElementById('speed'),
            gameOver: document.getElementById('game-over'),
            help: document.getElementById('help'),
            pause: document.getElementById('pause'),
            scoreTable: document.getElementById('score-table'),
            colorsEnableButton: document.getElementById('snake-colors-enable'),
            vibrationEnableButton: document.getElementById('snake-vibration-enable'),
            helpButton: document.getElementById('snake-help'),
            pauseButton: document.getElementById('snake-pause'),
            repoLinkButton: document.querySelector('#snake-github-link'),
            resetButton: document.getElementById('snake-reset'),
            leftButton: document.getElementById('snake-left'),
            upButton: document.getElementById('snake-up'),
            rightButton: document.getElementById('snake-right'),
            downButton: document.getElementById('snake-down'),
            scoreTableButton: document.getElementById('snake-show-score-table'),
            scoreTablePageUpButton: document.getElementById('snake-score-table-page-up'),
            scoreTablePageDownButton: document.getElementById('snake-score-table-page-down'),
            nameField: document.getElementById('name-field')
        };

        this._elements.nameFieldInput = this._elements.nameField.querySelector('.name-field__input');

        this._adapter = new Adapter(host, port);
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._speedFactor = speedFactor;
        this._rabbitsCount = rabbitsCount;
        this.highScore = Number(localStorage.getItem('snakeHighScore'));
        let colorsEnable = localStorage.getItem('snakeColorsEnable');
        this.colorsEnable = colorsEnable === null ? false : (colorsEnable === 'true');
        let vibrationEnable = localStorage.getItem('snakeVibrationEnable');
        this.vibrationEnable = vibrationEnable === null ? true : (vibrationEnable === 'true');
        this._baseSpeed = baseSpeed;
        this._baseSpeedIterationsCount = speedIterationsCount;
        this._speedIterationsCount = speedIterationsCount;
        this._foodLifeTime = foodLifeTime;
        this._foodFactor = foodFactor;
        this._inputQueueLimit = inputQueueLimit;
        this._levels = levels;
        this._cellRenderer = cellRenderer;
        this._nameMaxLength = nameMaxLength;
        this.name = '';

        this.nextIteration = this.nextIteration.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this.redrawDisplay = this.redrawDisplay.bind(this);
        this.render = this.render.bind(this);
        this._tableScorePageUp = this._tableScorePageUp.bind(this);
        this._tableScorePageDown = this._tableScorePageDown.bind(this);

        this._bindButtons();
        this._initKeyboard();
    }

    get highScore() {
        return this._highScore;
    }

    get score() {
        return this._score;
    }

    get level() {
        return this._level;
    }

    get speed() {
        return this._speed;
    }

    get gameOver() {
        return this._gameOver;
    }

    get colorsEnable() {
        return this._colorsEnable;
    }

    get vibrationEnable() {
        return this._vibrationEnable;
    }

    get name() {
        return this._name;
    }

    get nameFieldMode() {
        return this._nameFieldMode;
    }

    set highScore(value) {
        this._highScore = value;
        this._elements.highScore.innerHTML = value;
    }

    set score(value) {
        this._score = value;
        if (this.highScore < value)
            this.highScore = value;
        this._elements.score.innerHTML = value;
    }

    set level(value) {
        this._level = value;
        this._elements.level.innerHTML = value;
    }

    set speed(value) {
        this._speed = value;
        this._elements.speed.innerHTML = value;
    }

    set gameOver(value) {
        this._gameOver = !!value;
        if (this._gameOver) {
            this._elements.gameOver.innerHTML = 'GAME<br>OVER';
            this.nameFieldMode = true;
        }
        else {
            this._elements.gameOver.innerHTML = '';
            this.nameFieldMode = false;
        }
    }

    set colorsEnable(value) {
        this._colorsEnable = !!value;
        if (value)
            this._elements.colorsEnableButton.classList.add('push-button_active');
        else
            this._elements.colorsEnableButton.classList.remove('push-button_active');
        localStorage.setItem('snakeColorsEnable', this._colorsEnable);
        this.redrawDisplay();
    }

    set vibrationEnable(value) {
        this._vibrationEnable = !!value;
        if (value)
            this._elements.vibrationEnableButton.classList.add('push-button_active');
        else
            this._elements.vibrationEnableButton.classList.remove('push-button_active');
        localStorage.setItem('snakeVibrationEnable', this._vibrationEnable);
    }

    set name(value) {
        if (value.length > this._nameMaxLength) return;
        this._name = value;
        this._elements.nameFieldInput.innerHTML = this._name.padEnd(this._nameMaxLength, '_');
    }

    set cellRenderer(renderer) {
        if (typeof(renderer) === 'function')
            this._cellRenderer = renderer;
    }

    set nameFieldMode(state) {
        if (state && this.score > 0) {
            this._nameFieldMode = true;
            this.name = '';

            this._setActiveButton(0);
            this._elements.nameField.classList.remove('name-field_hidden');

            return;
        }

        this._nameFieldMode = false;
        this._elements.nameField.classList.add('name-field_hidden');
    }

    destroy() {
        this.stop();
        this.clearFieldLayout();
    }

    render() {
        const table = this._field.table();
        const display = this._elements.display;
        const width = display.width / this._sizeX;
        const height = display.height / this._sizeY;
        const ctx = display.getContext('2d');

        for (let i = 0; i < table.length; ++i) {
            ctx.clearRect(table[i].x * width, table[i].y * height, width, height);
            let cell;
            switch (table[i].value) {
                case 0:
                case 4:
                    cell = this._inactivePrerenderedCell;
                    break;
                case 1:
                    cell = this._foodPrerenderedCell;
                    break;
                case 2:
                    cell = this._snakePrerenderedCell;
                    break;
                case 3:
                    cell = this._activePrerenderedCell;
                    break;
            }
            ctx.drawImage(cell, table[i].x * width, table[i].y * height);
        }
    }

    async run(restart = false, levelUp = false) {
        this.reset(levelUp);
        this.gameOver = false;
        this._speedIterationsCount = this._baseSpeedIterationsCount;
        this._snake = new Snake();

        this._levelScore = 0;
        let start, end;

        if (levelUp || restart)
            [start, end] = this._levelUp();

        if (!start || !end) {
            start = [Math.ceil(this._field.sizeX / 2), Math.ceil(this._field.sizeY / 2)];
            end = [start[0], start[1] - 1];
        }

        this._snake.init(start, end);
        this._field.addItem(this._snake);
        this.render();
        await new Promise(resolve => setTimeout(resolve, 800));
        this._input.splice(0,this._input.length);
        for (let i = 0; i < this._rabbitsCount; ++i) {
            const rabbit = new Rabbit(this._foodLifeTime);
            this._field.addItem(rabbit);
        }
        if (!restart)
            this._bindEvents();

        this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
    }

    stop() {
        if (this._iterationTimer) {
            clearTimeout(this._iterationTimer);
            this._iterationTimer = null;
        }

        window.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('resize', this.redrawDisplay);
        this.reset();
    }

    reset(levelUp = false) {
        if (this._animationTimer) {
            cancelAnimationFrame(this._animationTimer);
            this._animationTimer = null;
        }
        this._field.clear();
        this._shouldGenerateFood = 0;
        this._speedIterationsCount = this._baseSpeedIterationsCount;
        if (!levelUp) {
            this.score = 0;
            this.speed = 0;
            this.level = -1;
        }
        this._input = [];
        this._iterationTimer = null;
        this._pause = false;
    }

    nextIteration() {
        if (this._shouldRedrawDisplay)
            this._redrawDisplay();
        else
            this._animationTimer = requestAnimationFrame(this.render);

        --this._speedIterationsCount;
        if (!this._speedIterationsCount) {
            ++this.speed;
            this._speedIterationsCount = this._baseSpeedIterationsCount;
        }

        const items = this._field.items;
        let moved = 1;
        let keyPressed = true;
        const food = [];

        for (let i = 0; i < items.length; ++i) {
            const item = items[i];

            if (item.movable && item !== this._snake)
                item.moveNext(this._field);

            if (item.isFood) {
                if (item.lifeTime > 0) {
                    --item.lifeTime;
                    food.push(item);
                }
                else {
                    this._field.removeItem(item);
                    ++this._shouldGenerateFood;
                }
            }
        }

        const lastKey = this._input.shift();

        switch (lastKey) {
            case 87: // W
            case 38: // UP
                moved = this._snake.moveUp(this._field);
                break;
            case 83: // S
            case 40: // DOWN
                moved = this._snake.moveDown(this._field);
                break;
            case 65: // A
            case 37: // LEFT
                moved = this._snake.moveLeft(this._field);
                break;
            case 68: // D
            case 39: // RIGHT
                moved = this._snake.moveRight(this._field);
                break;
            default:
                keyPressed = false;
                break;
        }

        if (!keyPressed)
            moved = this._snake.moveNext(this._field);

        if (!moved) {
            this.gameOver = true;
            let highScore = Number(localStorage.getItem('snakeHighScore'));
            this.highScore = Math.max(highScore, this.highScore);
            localStorage.setItem('snakeHighScore', this.highScore);
            return;
        }

        if (moved === 2) {
            for (let i = 0; i < food.length; ++i) {
                const item = food[i];

                if (item.eaten) {
                    this._incrementLevelScore(Math.max(1, item.lifeTime * this._foodFactor));
                    this._field.removeItem(item);
                    ++this._shouldGenerateFood;
                }
            }

            if (this._levelScore >= this._levels[this.level % this._levels.length].score) {
                this.run(false, true);
                return;
            }
            this._snake.grow();

        }

        for (let i = 0; i < this._shouldGenerateFood; ++i) {
            const rabbit = new Rabbit(this._foodLifeTime);
            this._field.addItem(rabbit);
        }
        this._shouldGenerateFood = 0;

        this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
    }

    createFieldLayout() {
        if (!this._cellRenderer)
            return false;

        const sizeX = this._sizeX;
        const sizeY = this._sizeY;
        const display = this._elements.display;

        display.width = display.clientWidth;
        display.height = display.clientHeight;
        const ctx = display.getContext('2d');

        const cellWidth = display.width / sizeX;
        const cellHeight = display.height / sizeY;
        const colorsEnable = this.colorsEnable;

        this._activePrerenderedCell = this._cellRenderer(cellWidth, cellHeight, true);
        this._inactivePrerenderedCell = this._cellRenderer(cellWidth, cellHeight);
        this._foodPrerenderedCell = this._cellRenderer(cellWidth, cellHeight, true, colorsEnable ? 'food' : 'default');
        this._snakePrerenderedCell = this._cellRenderer(cellWidth, cellHeight, true, colorsEnable ? 'snake' : 'default');

        for (let i = 0; i < sizeX; ++i) {
            for (let j = 0; j < sizeY; ++j)
                ctx.drawImage(this._inactivePrerenderedCell, i * cellWidth, j * cellHeight);
        }

        return true;
    }

    clearFieldLayout() {
        const display = this._elements.display;

        display.width = display.clientWidth;
        display.height = display.clientHeight;
    }

    redrawDisplay() {
        if (this.gameOver)
            this._redrawDisplay();
        else
            this._shouldRedrawDisplay = true;
    }

    _incrementLevelScore(value) {
        this._levelScore += value;
        this.score += value;
    }

    _levelUp() {
        ++this.level;
        const level = this._levels[this.level % this._levels.length];
        this.speed = level.speed + Math.floor(this.level / this._levels.length);

        for (let i = 0; i < level.items.length; ++i) {
            const item = level.items[i];

            if (item.type === 'wall') {
                const wall = new Wall();
                wall.start = item.start;
                wall.end = item.end;
                this._field.addItem(wall);
            }
            else if (item.type === 'barrier') {
                const barrier = new Barrier();
                barrier.start = item.start;
                barrier.end = item.end;
                barrier.pattern = item.pattern;
                this._field.addItem(barrier);
            }
        }

        return [level.snakeStart, level.snakeEnd];
    }

    _bindEvents() {
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('resize', this.redrawDisplay);
    }

    _onKeyUp(event) {
        const keyCode = event.keyCode;

        if (this.nameFieldMode) {
            if (keyCode === 27) // ESC: cancel
                this.nameFieldMode = false;
            else if (keyCode === 13) { // ENTER: send score
                if (this.name.length)
                    this._sendScore();
            }
            else if (keyCode === 32) // SPACE: apply symbol
                this._applyKeyboardSymbol();
            else if (keyCode === 38) // UP: move cursor up
                this._moveKeyboardCursor(0);
            else if (keyCode === 40) // DOWN: move cursor down
                this._moveKeyboardCursor(1);
            else if (keyCode === 37) // LEFT: move cursor left
                this._moveKeyboardCursor(2);
            else if (keyCode === 39) // RIGHT: move cursor right
                this._moveKeyboardCursor(3);
            else if (keyCode === 8) // BACKSPACE: remove last character
                this._keyboard[this._keyboard.length - 2].click();
            else if (keyCode >= 0x41 && keyCode < 0x5b) { // A-Z
                const symbol = this._keyboard.find(sym => sym.innerHTML.charCodeAt(0) === keyCode);
                if (symbol)
                    symbol.click();
            }
            else if (['_', '.', '-', '\'', '"'].includes(event.key)) { // other characters
                const symbol = this._keyboard.find(sym => sym.innerHTML.charAt(0) === event.key);
                if (symbol)
                    symbol.click();
            }
        }
        else if (keyCode === 82 || keyCode === 13) { // 'r' or ENTER: restart
            if (this._showHelp || this._pause || this._showScoreTable)
                return;

            if (this._iterationTimer) {
                clearTimeout(this._iterationTimer);
                this._iterationTimer = null;
                this.run(true);
                return;
            }
        }
        else if (keyCode === 80 || keyCode === 32) { // 'p' or SPACE: pause
            if (!this._showHelp && !this._showScoreTable)
                this._togglePause();
            return;
        }
        else if (keyCode === 72 || keyCode === 27) { // 'h' or ESC: help
            if (this._showScoreTable)
                return;
            this._showHelp = !this._showHelp;

            if (this._showHelp) {
                this._elements.help.classList.remove('help_hidden');
                this._elements.helpButton.classList.add('push-button_active');
            }
            else {
                this._elements.help.classList.add('help_hidden');
                this._elements.helpButton.classList.remove('push-button_active');
            }

            if (!this._pause)
                this._togglePause(true);
        }
        else if (keyCode === 67) // 'c': colors
            this.colorsEnable = !this.colorsEnable;
        else if (keyCode === 86) // 'v': vibration
            this.vibrationEnable = !this.vibrationEnable;
        else if (keyCode === 84) { // 't': score table
            if (this._showHelp)
                return;

            this._showScoreTable = !this._showScoreTable;
            this._toggleScoreTable();
        }
        else if (keyCode === 33) { // page up
            if (this._showScoreTable)
                this._tableScorePageUp();
        }
        else if (keyCode === 34) { // page down
            if (this._showScoreTable)
                this._tableScorePageDown();
        }
        else if (keyCode === 71) {// 'g': github link
            if (!this._showHelp && !this._showScoreTable)
                this._togglePause();

            window.open(REPO_LINK, '_blank');
            return;
        }

        const input = this._input;
        const len = input.length;

        if (this._availableKeys.includes(keyCode) && len < this._inputQueueLimit && (!len || input[len - 1] !== keyCode))
            input.push(keyCode);
    }

    _togglePause(ignoreFlag = false) {
        if (this.gameOver)
            return;

        if (this._iterationTimer) {
            clearTimeout(this._iterationTimer);
            this._iterationTimer = null;
            this._elements.pause.innerHTML = 'PAUSE';
            this._elements.pauseButton.classList.add('push-button_active');
            if (!ignoreFlag)
                this._pause = true;
        }
        else {
            this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
            this._elements.pause.innerHTML = '';
            this._elements.pauseButton.classList.remove('push-button_active');
            if (!ignoreFlag)
                this._pause = false;
        }
    }

    _timeout() {
        return this._baseSpeed - this._speed * this._speedFactor;
    }

    _bindButtons() {
        const vibrationClick = func => () => {
            func();
            if (this.vibrationEnable)
                navigator.vibrate(35);
        };

        this._elements.pauseButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 32})));
        this._elements.resetButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 13})));
        this._elements.leftButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 37})));
        this._elements.upButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 38})));
        this._elements.rightButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 39})));
        this._elements.downButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 40})));
        this._elements.helpButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 27})));
        this._elements.scoreTableButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 84})));
        this._elements.colorsEnableButton.addEventListener('click',
            vibrationClick(() => this.colorsEnable = !this.colorsEnable));
        this._elements.vibrationEnableButton.addEventListener('click',
            vibrationClick(() => this.vibrationEnable = !this.vibrationEnable));
        this._elements.repoLinkButton.addEventListener('click', vibrationClick(() => this._onKeyUp({keyCode: 71})));
    }

    _redrawDisplay() {
        this._shouldRedrawDisplay = false;
        this._field.clearPreviousTable();
        this.createFieldLayout();
        this.render();
    }

    async _toggleScoreTable(table = null) {
        if (!this._pause)
            this._togglePause(true);

        if (this._showScoreTable) {
            let scoreTable;
            if (table)
                scoreTable = table;
            else {
                try {
                    scoreTable = await this._adapter.updateScoreTable();
                }
                catch (reason) {
                    scoreTable = null;
                }
            }
            const scoreTableElement = this._elements.scoreTable.querySelector('.score-table__table');
            scoreTableElement.style.top = '0';
            if (scoreTable) {
                let table = '<tr><th class="score-table__table-header_left">#</th>' +
                    '<th class="score-table__table-header_left">NAME</th>' +
                    '<th class="score-table__table-header_right">SCORE</th></tr>';
                for (let i = 0; i < scoreTable.length; ++i) {
                    const item = scoreTable[i];
                    table += `<tr class="score-table__item ${item.you ? 'score-table__item_active' : ''}">` +
                        `<td class="score-table__item-text">${Number(i + 1)}</td>` +
                        `<td class="score-table__item-text">${item.name}</td>` +
                        `<td class="score-table__item-score">${item.score}</td>` +
                        '</tr>';
                }
                scoreTableElement.innerHTML = table;
            }
            else
                scoreTableElement.innerHTML = '<tr><th>UNAVAILABLE</th></tr>';

            this._elements.scoreTable.classList.remove('score-table_hidden');
            this._elements.scoreTableButton.classList.add('push-button_active');
            this._elements.scoreTablePageUpButton.addEventListener('click', this._tableScorePageUp);
            this._elements.scoreTablePageDownButton.addEventListener('click', this._tableScorePageDown);
        }
        else {
            this._elements.scoreTable.classList.add('score-table_hidden');
            this._elements.scoreTableButton.classList.remove('push-button_active');
            this._elements.scoreTablePageUpButton.removeEventListener('click', this._tableScorePageUp);
            this._elements.scoreTablePageDownButton.removeEventListener('click', this._tableScorePageDown);
        }
    }

    _tableScorePageUp() {
        const scoreTableElement = this._elements.scoreTable.querySelector('.score-table__table');
        if (scoreTableElement.parentElement.clientHeight > scoreTableElement.clientHeight)
            return;

        const next = ((scoreTableElement.style.top ? parseInt(scoreTableElement.style.top) : 0) + 4);
        scoreTableElement.style.top = Math.min(next, 0) + 'vh';
    }

    _tableScorePageDown() {
        const scoreTableElement = this._elements.scoreTable.querySelector('.score-table__table');
        if (scoreTableElement.parentElement.clientHeight > scoreTableElement.clientHeight)
            return;

        const next = ((scoreTableElement.style.top ? parseInt(scoreTableElement.style.top) : 0) - 4);
        const vh = document.documentElement.clientHeight / 100;

        if (next * vh + scoreTableElement.clientHeight > (scoreTableElement.parentElement.clientHeight - 6 * vh))
            scoreTableElement.style.top = next + 'vh';
    }

    _initKeyboard() {
        const nameField = this._elements.nameField;
        const keyboard = nameField.querySelector('.name-field__keyboard');

        const createSymbol = (value, fromCode = true) => {
            const sym = document.createElement('div');

            sym.innerHTML = fromCode ? String.fromCharCode(value) : value;
            sym.classList.add('name-field__symbol');
            keyboard.appendChild(sym);
            const index = this._keyboard.length;
            this._keyboard.push(sym);

            return [sym, index];
        };

        for (let i = 0x41; i < 0x5b; ++i) {
            const [literal, index] = createSymbol(i);
            literal.addEventListener('click', () => {
                this.name += String.fromCharCode(i);
                this._setActiveButton(index);
            });
        }
        ['_', '.', '-', '\'', '"'].forEach(value => {
            const [symbol, index] = createSymbol(value, false);
            symbol.addEventListener('click', () => {
                this.name += value;
                this._setActiveButton(index);
            });
        });

        const [backspace, index] = createSymbol(0x2190);
        backspace.addEventListener('click', () => {
            this.name = this._name.slice(0, this._name.length - 1);
            this._setActiveButton(index);
        });

        const done = nameField.querySelector('.name-field__symbol_done');
        done.addEventListener('click', this._sendScore.bind(this));
        this._keyboard.push(done);
    }

    async _sendScore() {
        this._setActiveButton(this._keyboard.length - 1);
        const scoreTable = await this._adapter.saveScore(this.name, this.score);
        if (scoreTable) {
            this._showScoreTable = true;
            this._toggleScoreTable(scoreTable);
        }
        this.nameFieldMode = false;
    }

    _moveKeyboardCursor(direction) {
        const index = this._keyboardActiveIndex;
        const len = this._keyboard.length;

        if (index === -1) {
            this._setActiveButton(0);
            return;
        }

        switch (direction) {
            case 0: // up
                this._setActiveButton(Math.max((Math.floor(index / 8) - 1) * 8 + (index % 8), 0));
                break;
            case 1: // down
                this._setActiveButton(Math.min((Math.floor(index / 8) + 1) * 8 + (index % 8), len - 1));
                break;
            case 2: // left
                this._setActiveButton(Math.max(index - 1, 0));
                break;
            case 3: // right
                this._setActiveButton(Math.max(index + 1, 0));
                break;
        }
    }

    _applyKeyboardSymbol() {
        if (this._keyboardActive)
            this._keyboardActive.click();
    }

    _setActiveButton(index) {
        const board = this._keyboard;
        for (let i = 0; i < board.length; ++i)
            board[i].classList.remove('name-field__symbol_active');
        board[index].classList.add('name-field__symbol_active');
        this._keyboardActive = board[index];
        this._keyboardActiveIndex = index;
    }
}
