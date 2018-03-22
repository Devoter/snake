/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class GameItem {
    constructor() {
        this._connected = false;
    }

    get isFood() {
        return false;
    }

    get points() {
        return [[-1, -1]];
    }

    connected() {
        return this._connected;
    }

    disconnect() {
        this._connected = false;
    }

    initialized() {
        return false;
    }

    place() {
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameItem;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_app_scss__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_app_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_app_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__levels__ = __webpack_require__(9);




document.addEventListener('DOMContentLoaded', function () {
    let game = new __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */](__WEBPACK_IMPORTED_MODULE_2__levels__["a" /* default */]);
    game.run(false, true);
});


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rabbit__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wall__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__snake__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__field__ = __webpack_require__(8);





class Game {
    constructor(levels = null, sizeX = 10, sizeY = 20, baseSpeed = 400, speedFactor = 10, speedIterationsCount = 25, foodLifeTime = 25, foodFactor = 1,
        inputQueueLimit = 4) {
        this._field = new __WEBPACK_IMPORTED_MODULE_3__field__["a" /* default */](sizeX, sizeY);
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
        this._level = -1;
        this._speed = 0;
        this._speedFactor = speedFactor;
        this.highScore = Number(localStorage.getItem('snakeHighScore'));
        let arrowsEnable = localStorage.getItem('snakeArrowsEnable');
        this.arrowsEnable = arrowsEnable === undefined ? true : !!arrowsEnable;
        this._score = 0;
        this._levelScore = 0;
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

    run(restart = false, levelUp = false) {
        this.reset(levelUp);
        this.gameOver = false;
        this._speedIterationsCount = this._baseSpeedIterationsCount;
        this._snake = new __WEBPACK_IMPORTED_MODULE_2__snake__["a" /* default */]();

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
        let rabbit = new __WEBPACK_IMPORTED_MODULE_0__rabbit__["a" /* default */](this._foodLifeTime);
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

    reset(levelUp = false) {
        this._field.clear();
        this._shouldGenerateFood = false;
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
                this._incrementLevelScore(Math.max(1, item.lifeTime * this._foodFactor));
                this._field.removeItem(item);
            });
            if (this._levelScore >= this._levels[this.level % this._levels.length].score) {
                this.run(false, true);
                return;
            }
            this._snake.grow();
            this._shouldGenerateFood = true;
        }

        if (this._shouldGenerateFood) {
            this._shouldGenerateFood = false;
            let rabbit = new __WEBPACK_IMPORTED_MODULE_0__rabbit__["a" /* default */](this._foodLifeTime);
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
                let wall = new __WEBPACK_IMPORTED_MODULE_1__wall__["a" /* default */]();
                wall.start = item.start;
                wall.end = item.end;
                this._field.addItem(wall);
            }
        }

        return [level.snakeStart, level.snakeEnd];
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__food__ = __webpack_require__(5);


class Rabbit extends __WEBPACK_IMPORTED_MODULE_0__food__["a" /* default */] {
    constructor(lifeTime = 20, x = -1, y = -1) {
        super(lifeTime);
        this._x = x;
        this._y = y;
    }

    get points() {
        return [[this._x, this._y]];
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

    initialized() {
        return this._x >= 0 && this._y >= 0;
    }

    place(field) {
        if (this._connected)
            return false;

        let placed = false;

        if (this.initialized())
            return !(field.items.some(item => item.points.some(point => point[0] === this._x && point[1] === this._y)));
        
        do {
            let x = Math.floor(Math.random() * field.sizeX);
            let y = Math.floor(Math.random() * field.sizeY);
            
            if (field.items.some(item => item.points.some(point => point[0] === x && point[1] === y)))
                continue;
            
            this.x = x;
            this.y = y;
            placed = true;
        } while (!placed);

        this._connected = true;
        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Rabbit;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_item__ = __webpack_require__(0);


class Food extends __WEBPACK_IMPORTED_MODULE_0__game_item__["a" /* default */] {
    constructor(lifeTime = 25) {
        super();
        this._lifeTime = lifeTime;
        this._eaten = false;
    }

    get isFood() {
        return true;
    }

    get lifeTime() {
        return this._lifeTime;
    }

    get eaten() {
        return this._eaten;
    }

    set lifeTime(value) {
        this._lifeTime = value;
    }

    set eaten(value) {
        this._eaten = !!value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Food;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_item__ = __webpack_require__(0);


class Wall extends __WEBPACK_IMPORTED_MODULE_0__game_item__["a" /* default */] {
    constructor() {
        super();
        this._points = [];
        this._start = [-1, -1];
        this._end = [-1, -1];
    }

    get points() {
        return this._points;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    set start(point) {
        this._start = [point[0], point[1]];
        this._updatePoints();
    }

    set end(point) {
        this._end = [point[0], point[1]];
        this._updatePoints();
    }

    initialized() {
        return this._points.length > 1;
    }

    place(field) {
        if (!this._connected && this.initialized() && !field.items.some(item => item.points.some(point =>
            this._points.some(p => point[0] === p[0] && point[1] === p[1])))) {
            this._connected = true;
            return true;
        }

        return false;
    }

    _updatePoints() {
        const start = this._start;
        const end = this._end;

        if (start[0] === -1 || start[1] === -1 || end[0] === -1 || end[1] === -1) {
            this._points = [];
            return;
        }

        let points = [];


        for (let x = Math.min(start[0], end[0]); x <= Math.max(start[0], end[0]); ++x) {
            for (let y = Math.min(start[1], end[1]); y <= Math.max(start[1], end[1]); ++y)
                points.push([x, y]);
        }

        this._points = points;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Wall;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_item__ = __webpack_require__(0);


class Snake extends __WEBPACK_IMPORTED_MODULE_0__game_item__["a" /* default */] {
    constructor() {
        super();
        this._points = [];
        this._grow = false;
        this._angle = 0;
    }

    get points() {
        return this._points;
    }

    get angle() {
        return this._angle;
    }

    init(start, end) {
        if (!(start instanceof Array) || !(end instanceof Array) || start.length !== 2 || end.length !== 2)
        return;

        this._points.push(start);
        this._points.push(end);

        if (start[0] < end[0])
            this._angle = 2;
        else if (start[0] > end[0])
            this._angle = 0;
        else if (start[1] < end[1])
            this._angle = 3;
        else
            this._angle = 1;
    }

    grow() {
        this._grow = true;
    }

    move(field, condition, deltaX = 0, deltaY = 0) {
        let head = this._points[this._points.length - 1];
        let newHead = [head[0] + deltaX, head[1] + deltaY];
        let moved = 1;
        if (!condition(newHead, field.sizeX, field.sizeY))
            moved = 0;
        else {
            for (let i = 0; i < field.items.length && moved === 1; ++i) {
                let item = field.items[i];
                let points = item.points;

                for (let j = 0; j < points.length; ++j) {
                    if (points[j][0] === newHead[0] && points[j][1] === newHead[1]) {
                        if (item === this && j === points.length - 2)
                            moved = 3;
                        else if (item.isFood) {
                            moved = 2;
                            item.eaten = true;
                        }
                        else
                            moved = 0;
                        break;
                    }
                }
            }
        }

        if (moved && moved !== 3) {
            if (this._grow)
                this._grow = false;
            else
                this._points.splice(0, 1);
            this._points.push(newHead);
        }

        return moved;
    }

    moveNext(field) {
        switch (this._angle) {
            case 0:
                return this.moveLeft(field);
            case 1:
                return this.moveUp(field);
            case 2:
                return this.moveRight(field);
            case 3:
                return this.moveDown(field);
        }
        return 1;
    }

    moveLeft(field) {
        let moved = this.move(field, head => head[0] >= 0, -1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 0;
        return moved;
    }

    moveRight(field) {
        let moved = this.move(field, (head, sizeX) => head[0] < sizeX, 1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 2;
        return moved;
    }

    moveUp(field) {
        let moved = this.move(field, head => head[1] >= 0, 0, -1);
        if (moved === 3)
            return this.moveNext(field);
        
        this._angle = 1;
        return moved;
    }

    moveDown(field) {
        let moved = this.move(field, (head, sizeX, sizeY) => head[1] < sizeY, 0, 1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 3;
        return moved;
    }

    initialized() {
        return this._points.length > 1;
    }

    place(field) {
        if (this.initialized()) {
            let placed = !field.items.some(item => item.points.some(point => this._points.some(p => p[0] === point[0] && p[1] === point[1])));

            if (placed)
                this._connected = true;

            return placed;
        }

        let placed = false;
        let counter = 0;
        let outOfCounter = field.sizeX * field.sizeY;

        do {
            if (counter >= outOfCounter)
                return false;

            let x1 = Math.floor(Math.random() * field.sizeX);
            let y1 = Math.floor(Math.random() * field.sizeY);
            let angle = Math.floor(Math.random() * 4);
            let x2, y2;
            switch(angle) {
                case 0:
                    x2 = x1 ? x1 - 1 : x1 + 1;
                    y2 = y1;
                    break;
                case 1:
                    x2 = x1;
                    y2 = y1 ? y1 - 1 : y1 + 1;
                    break;
                case 2:
                    x2 = x1 < (field.sizeX - 1) ? x1 + 1 : x1 - 1;
                    y2 = y1;
                    break;
                case 3:
                    x2 = x1;
                    y2 = y1 < (field.sizeY - 1) ? y1 + 1 : y1 - 1;
                    break;
            }
            
            if (field.items.some(item => item.points.some(point =>
                (point[0] === x1 && point[1] === y1) || (point[0] === x2 && point[1] === y2)))) {
                counter++;
                continue;
            }
            
            this._points = [[x1, y1], [x2, y2]];
            this._connected = true;
            placed = true;
        } while (!placed);

        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Snake;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_item__ = __webpack_require__(0);


class Field {
    constructor(sizeX, sizeY) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._items = [];
        this._count = 0;
        this._maxCount = this._sizeX * this._sizeY;
    }

    get items() {
        return this._items.slice();
    }

    table() {
        let t = [];
        for (let x = 0; x < this._sizeX; ++x) {
            t.push([]);
            for (let y = 0; y < this._sizeY; ++y) {
                t[x].push(false);
            }
        }

        for (let i = 0; i < this._items.length; ++i) {
            let item = this._items[i];
            let points = item.points;
            for (let j = 0; j < points.length; ++j) {
                let point = points[j];
                t[point[0]][point[1]] = !(item.isFood && item.lifeTime < 6 && item.lifeTime % 2 !== 0);
            }
        }

        return t;
    }

    get sizeX() {
        return this._sizeX;
    }

    get sizeY() {
        return this._sizeY;
    }

    get count() {
        return this._count;
    }

    available() {
        return (this._maxCount - this._count) > 0;
    }

    addItem(item) {
        if (!(item instanceof __WEBPACK_IMPORTED_MODULE_0__game_item__["a" /* default */]) || !this.available() || this._items.findIndex(i => i === item) !== -1 || !item.place(this))
            return false;

        this._items.push(item);
        this._count += item.points.length;
        return true;
    }

    removeItem(item) {
        let index = this._items.findIndex(i => i === item);
        if (index === -1)
            return;

        this._count -= item.points.length;
        this._items.splice(index, 1);
    }

    clear() {
        this._items = [];
        this._count = 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Field;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const levels = [
    {
        speed: 0,
        score: 50,
        items: []
    },
    {
        speed: 1,
        score: 300,
        items: []
    },
    {
        speed: 2,
        score: 500,
        items: []
    },
    {
        speed: 0,
        score: 500,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [2, 2]
            },
            {
                type: 'wall',
                start: [7, 1],
                end: [8, 2]
            }
        ]
    },
    {
        speed: 0,
        score: 1000,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [2, 2]
            },
            {
                type: 'wall',
                start: [7, 1],
                end: [8, 2]
            },
            {
                type: 'wall',
                start: [1, 17],
                end: [2, 18]
            },
            {
                type: 'wall',
                start: [7, 17],
                end: [8, 18]
            }
        ]
    },
    {
        speed: 0,
        score: 500,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [1, 4]
            },
            {
                type: 'wall',
                start: [2, 1],
                end: [4, 1]
            },
            {
                type: 'wall',
                start: [3, 3],
                end: [4, 4]
            },
            {
                type: 'wall',
                start: [4, 18],
                end: [7, 18]
            },
            {
                type: 'wall',
                start: [8, 15],
                end: [8, 18]
            },
            {
                type: 'wall',
                start: [5, 15],
                end: [6, 16]
            }
        ]
    },
    {
        speed: 0,
        score: 500,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [1, 10]
            },
            {
                type: 'wall',
                start: [2, 1],
                end: [4, 1]
            },
            {
                type: 'wall',
                start: [3, 3],
                end: [4, 6]
            },
            {
                type: 'wall',
                start: [2, 18],
                end: [7, 17]
            },
            {
                type: 'wall',
                start: [8, 12],
                end: [8, 18]
            },
            {
                type: 'wall',
                start: [9, 0],
                end: [9, 2]
            }
        ]
     },
    {
        speed: 0,
        score: 256,
        items: [
            {
                type: 'wall',
                start: [0, 3],
                end: [1, 3]
            },
            {
                type: 'wall',
                start: [0, 14],
                end: [5, 14]
            },
            {
                type: 'wall',
                start: [2, 6],
                end: [2, 11]
            },
            {
                type: 'wall',
                start: [3, 6],
                end: [4, 6]
            },
            {
                type: 'wall',
                start: [3, 11],
                end: [6, 11]
            },
            {
                type: 'wall',
                start: [4, 3],
                end: [6, 3]
            },
            {
                type: 'wall',
                start: [7, 3],
                end: [7, 11]
            },
            {
                type: 'wall',
                start: [4, 17],
                end: [7, 19]
            },
            {
                type: 'wall',
                start: [8, 14],
                end: [9, 14]
            }
        ]
    }
];

/* harmony default export */ __webpack_exports__["a"] = (levels);


/***/ })
/******/ ]);
//# sourceMappingURL=snake.js.map