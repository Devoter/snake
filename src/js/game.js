import Rabbit from './rabbit';
import Wall from './wall';
import Snake from './snake';
import Field from './field';

export default class Game {
    constructor(sizeX = 10, sizeY = 20, baseSpeed = 400, speedFactor = 10, speedIterationsCount = 25, foodLifeTime = 20, foodFactor = 5) {
        this._field = new Field(sizeX, sizeY);
        this._cells = new Array(sizeX);
        for (let x = 0; x < sizeX; ++x)
            this._cells[x] = new Array(sizeY);

        this._createFieldLayout(sizeX, sizeY);
        this._snake = null;
        this._lastKey = null;
        this._iterationTimer = null;
        this._level = 0;
        this._speed = 0;
        this._speedFactor = speedFactor;
        this.highScore = Number(localStorage.getItem('highScore'));
        this._score = 0;
        this._showHelp = false;
        this._baseSpeed = baseSpeed;
        this._baseSpeedIterationsCount = speedIterationsCount;
        this._speedIterationsCount = speedIterationsCount;
        this._shouldGenerateFood = false;
        this._foodLifeTime = foodLifeTime;
        this._foodFactor = foodFactor;
        this._pause = false;

        this.nextIteration = this.nextIteration.bind(this);
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

    set highScore(value) {
        this._highScore = value;
        document.getElementById('high-score').innerHTML = value;
    }

    set score(value) {
        this._score = value;
        if (this.highScore < value)
            this.highScore = value;
        document.getElementById('score').innerHTML = value;
    }

    set level(value) {
        this._level = value;
        document.getElementById('level').innerHTML = value;
    }

    set speed(value) {
        this._speed = value;
        document.getElementById('speed').innerHTML = value;
    }

    set gameOver(value) {
        this._gameOver = !!value;
        document.getElementById('game-over').innerHTML = value ? 'GAME<br>OVER' : '';
    }

    render() {
        const table = this._field.table();

        for (let x = 0; x < this._cells.length; ++x) {
            for (let y = 0; y < this._cells[x].length; ++y)
                this._cells[x][y].className = 'snake-cell' + (table[x][y] ? ' snake-cell_active' : '');
        }
    }

    run(restart = false, config = null) {
        if (restart) {
            this._shouldGenerateFood = false;
            this._speedIterationsCount = this._baseSpeedIterationsCount;
            this.score = 0;
            this.speed = 0;
            this.level = 0;
            this._lastKey = null;
            this._iterationTimer = null;
            this._pause = false;
        }
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
            this._bindKeys();

        this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
        this._generatorCounter = this._generatorFrequency;
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

        switch(this._lastKey) {
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
        this._lastKey = null;

        if (!keyPressed)
            moved = this._snake.moveNext(this._field);

        if (!moved) {
            this.gameOver = true;
            let highScore = Number(localStorage.getItem('highScore'));
            this.highScore = Math.max(highScore, this.highScore);
            localStorage.setItem('highScore', this.highScore);
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

    _createFieldLayout(sizeX, sizeY) {
        const container = document.getElementById('snake');

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
        document.getElementById('snake').innerHTML = '';
    }

    _bindKeys() {
        window.addEventListener('keyup', event => {
            if (event.keyCode === 82 || event.keyCode === 13) { // restart
                if (this._showHelp)
                    return;

                if (this._iterationTimer) {
                    clearTimeout(this._iterationTimer);
                    this._iterationTimer = null;
                    this._lastKey = null;
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
            else if (event.keyCode === 72) {
                this._showHelp = !this._showHelp;

                document.getElementById('help').className = 'help' + (this._showHelp ? '' : ' help_hidden');
                if (!this._pause)
                    this._togglePause(true);
            }
            this._lastKey = event.keyCode;
        });
    }

    _togglePause(ignoreFlag = false) {
        if (this._iterationTimer) {
            clearTimeout(this._iterationTimer);
            this._iterationTimer = null;
            document.getElementById('pause').innerHTML = 'PAUSE';
            if (!ignoreFlag)
                this._pause = true;
        }
        else {
            this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
            document.getElementById('pause').innerHTML = '';
            if (!ignoreFlag)
                this._pause = false;
        }
    }

    _timeout() {
        return this._baseSpeed - this._speed * this._speedFactor;
    }
}
