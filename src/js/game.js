import Rabbit from './rabbit';
import Wall from './wall';
import Snake from './snake';
import Field from './field';

export default class Game {
    constructor(levels = null, sizeX = 10, sizeY = 20, baseSpeed = 400, speedFactor = 10, speedIterationsCount = 25, foodLifeTime = 25, foodFactor = 1,
        inputQueueLimit = 4) {
        this._field = new Field(sizeX, sizeY);
        this._cells = new Array(sizeX);
        for (let x = 0; x < sizeX; ++x)
            this._cells[x] = new Array(sizeY);

        this._elements = {
            highScore: document.getElementById('high-score'),
            score:  document.getElementById('score'),
            level: document.getElementById('level'),
            speed: document.getElementById('speed'),
            gameOver: document.getElementById('game-over'),
            snakeGame: document.getElementById('snake'),
            help: document.getElementById('help'),
            pause: document.getElementById('pause'),
            arrowsEnableButton: document.getElementById('snake-arrows-enable'),
            helpButton: document.getElementById('snake-help'),
            pauseButton: document.getElementById('snake-pause'),
            resetButton: document.getElementById('snake-reset'),
            leftButton: document.getElementById('snake-left'),
            upButton: document.getElementById('snake-up'),
            rightButton: document.getElementById('snake-right'),
            downButton: document.getElementById('snake-down')
        };

        this._createFieldLayout(sizeX, sizeY);
        this._snake = null;
        this._input = [];
        this._iterationTimer = null;
        this._level = 0;
        this._speed = 0;
        this._speedFactor = speedFactor;
        this.highScore = Number(localStorage.getItem('snakeHighScore'));
        let arrowsEnable = localStorage.getItem('snakeArrowsEnable');
        this.arrowsEnable = arrowsEnable === undefined ? true : !!arrowsEnable;
        this._score = 0;
        this._showHelp = false;
        this._baseSpeed = baseSpeed;
        this._baseSpeedIterationsCount = speedIterationsCount;
        this._speedIterationsCount = speedIterationsCount;
        this._shouldGenerateFood = false;
        this._foodLifeTime = foodLifeTime;
        this._foodFactor = foodFactor;
        this._pause = false;
        this._inputQueueLimit = inputQueueLimit;
        this._levels = levels;

        this.nextIteration = this.nextIteration.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onClick = this._onClick.bind(this);
        this._availableKeys = [37, 38, 39, 40, 65, 87, 68, 83];

        this._bindButtons();
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

    get arrowsEnable() {
        return this._arrowsEnable;
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
        this._elements.gameOver.innerHTML = value ? 'GAME<br>OVER' : '';
    }

    set arrowsEnable(value) {
        this._arrowsEnable = !!value;
        this._elements.arrowsEnableButton.className = 'push-button push-button_small' + (value ? ' push-button_active' : '');
        localStorage.setItem('snakeArrowsEnable', this._arrowsEnable);
    }

    destroy() {
        this.stop();
        this._clearFieldLayout();
    }

    render() {
        const table = this._field.table();

        for (let x = 0; x < this._cells.length; ++x) {
            for (let y = 0; y < this._cells[x].length; ++y)
                this._cells[x][y].className = 'snake-cell' + (table[x][y] ? ' snake-cell_active' : '');
        }
    }

    run(restart = false, config = null) {
        if (restart)
            this.reset();
        this.gameOver = false;
        this._speedIterationsCount = this._baseSpeedIterationsCount;
        this._snake = new Snake();

        let start = [Math.ceil(this._field.sizeX / 2), Math.ceil(this._field.sizeY / 2)];
        let end = [start[0], start[1] - 1];

        this._snake.init(start, end);
        if (config !== null) {
            config.forEach(item => {
                let wall = new Wall();
                wall.start = item.start;
                wall.end = item.end;
                this._field.addItem(wall);
            });
        }
        this._field.addItem(this._snake);
        let rabbit = new Rabbit(this._foodLifeTime);
        this._field.addItem(rabbit);
        this.render();
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
        window.removeEventListener('click', this._onClick);
        this.reset();
    }

    reset() {
        this._shouldGenerateFood = false;
        this._speedIterationsCount = this._baseSpeedIterationsCount;
        this.score = 0;
        this.speed = 0;
        this.level = 0;
        this._input = [];
        this._iterationTimer = null;
        this._pause = false;
    }

    nextIteration() {
        --this._speedIterationsCount;
        if (!this._speedIterationsCount) {
            ++this.speed;
            this._speedIterationsCount = this._baseSpeedIterationsCount;
        }

        let moved = true;
        let keyPressed = true;

        let food = this._field.items.filter(item => item.isFood);
        food.forEach(item => {
            if (item.lifeTime > 0)
                --item.lifeTime;
        });

        let lastKey = this._input.shift();

        switch(lastKey) {
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
            let itemsToRemove = food.filter(item => item.eaten);

            itemsToRemove.forEach(item => {
                this.score += Math.max(1, item.lifeTime * this._foodFactor);
                this._field.removeItem(item);
            });
            this._snake.grow();
            this._shouldGenerateFood = true;
        }

        if (this._shouldGenerateFood) {
            this._shouldGenerateFood = false;
            let rabbit = new Rabbit(this._foodLifeTime);
            this._field.addItem(rabbit);
        }

        this.render();
        this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
    }

    addInput(keyCode) {
        const input = this._input;
        const len = input.length;

        if (this._availableKeys.includes(keyCode) && len < this._inputQueueLimit && (!len || input[len - 1] !== keyCode))
            input.push(keyCode);
    }

    _createFieldLayout(sizeX, sizeY) {
        const container = this._elements.snakeGame;

        for (let y = 0; y < sizeY; ++y) {
            for (let x = 0; x < sizeX; ++x) {
                let cell = document.createElement('div');
                cell.className = 'snake-cell';
                this._cells[x][y] = cell;
                container.appendChild(cell);
            }
        }

    }

    _clearFieldLayout() {
        this._elements.snakeGame.innerHTML = '';
    }

    _bindEvents() {
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('click', this._onClick);
    }

    _onKeyUp(event) {
        if (event.keyCode === 82 || event.keyCode === 13) { // restart
            if (this._showHelp || this._pause)
                return;

            if (this._iterationTimer) {
                clearTimeout(this._iterationTimer);
                this._iterationTimer = null;
                this._field.clear();
                this.run(true);
                return;
            }
        }
        else if (event.keyCode === 80 || event.keyCode === 32) { // pause
            if (!this._showHelp)
                this._togglePause();
            return;
        }
        else if (event.keyCode === 72 || event.keyCode === 27) { // help
            this._showHelp = !this._showHelp;

            this._elements.help.className = 'help' + (this._showHelp ? '' : ' help_hidden');
            this._elements.helpButton.className = 'push-button push-button_small' + (this._showHelp ? ' push-button_active' : '');
            if (!this._pause)
                this._togglePause(true);
        }
        this.addInput(event.keyCode);
    }

    _onClick(event) {
        if (this._showHelp || this._pause || this.arrowsEnable)
            return;

        const angle = this._snake.angle;
        const x = event.x;
        const y = event.y;
        const snakeHead = this._getSnakeHeadElement();
        const rect = snakeHead.getBoundingClientRect();
        const rectXRight = rect.x + rect.width;
        const rectYBottom = rect.y + rect.height;
        const deltaXL = rect.x - x;
        const deltaYT = rect.y - y;
        const deltaXR = x - rectXRight;
        const deltaYB = y - rectYBottom;

        if (x < rect.x && ((deltaXL > deltaYT && angle === 1) || (deltaXL > deltaYB && angle === 3))) // left
            this.addInput(37);
        else if (y < rect.y && ((deltaYT > deltaXL && angle === 0) || (deltaYT > deltaXR && angle === 2))) // top
            this.addInput(38);
        else if (x > rectXRight && ((deltaXR > deltaYT && angle === 1) || (deltaXR > deltaYB && angle === 3))) // right
            this.addInput(39);
        else if (y > rectYBottom && ((deltaYB > deltaXL && angle === 0) || (deltaYB > deltaXR && angle === 2))) // bottom
            this.addInput(40);
    }

    _togglePause(ignoreFlag = false) {
        if (this.gameOver)
            return;

        if (this._iterationTimer) {
            clearTimeout(this._iterationTimer);
            this._iterationTimer = null;
            this._elements.pause.innerHTML = 'PAUSE';
            this._elements.pauseButton.className = 'push-button push-button_big push-button_active';
            if (!ignoreFlag)
                this._pause = true;
        }
        else {
            this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
            this._elements.pause.innerHTML = '';
            this._elements.pauseButton.className = 'push-button push-button_big';
            if (!ignoreFlag)
                this._pause = false;
        }
    }

    _timeout() {
        return this._baseSpeed - this._speed * this._speedFactor;
    }

    _getSnakeHeadElement() {
        const head = this._snake.points[this._snake.points.length - 1];
        return this._cells[head[0]][head[1]];
    }

    _bindButtons() {
        this._elements.arrowsEnableButton.addEventListener('click', () => this.arrowsEnable = !this.arrowsEnable);
        this._elements.pauseButton.addEventListener('click', () => this._onKeyUp({keyCode: 32}));
        this._elements.resetButton.addEventListener('click', () => this._onKeyUp({keyCode: 13}));
        this._elements.leftButton.addEventListener('click', () => {
            if (this.arrowsEnable)
                this.addInput(37);
        });
        this._elements.upButton.addEventListener('click', () => {
            if (this.arrowsEnable)
                this.addInput(38);
        });
        this._elements.rightButton.addEventListener('click', () => {
            if (this.arrowsEnable)
                this.addInput(39);
        });
        this._elements.downButton.addEventListener('click', () => {
            if (this.arrowsEnable)
                this.addInput(40);
        });
        this._elements.helpButton.addEventListener('click', () => this._onKeyUp({keyCode: 27}));
    }
}
