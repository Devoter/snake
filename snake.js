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
/******/ 	__webpack_require__.p = "/";
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



document.addEventListener('DOMContentLoaded', function () {
    let game = new __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */]();
    game.run();
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
    constructor(sizeX = 10, sizeY = 20, baseSpeed = 400, speedFactor = 10, speedIterationsCount = 25, foodLifeTime = 20, foodFactor = 5) {
        this._field = new __WEBPACK_IMPORTED_MODULE_3__field__["a" /* default */](sizeX, sizeY);
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
        this.arrowsEnable = Boolean(localStorage.getItem('snakeArrowsEnable'));
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
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onClick = this._onClick.bind(this);

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

    set arrowsEnable(value) {
        this._arrowsEnable = !!value;
        document.getElementById('snake-arrows-enable').className = 'push-button push-button_small' + (value ? ' push-button_active' : '');
        localStorage.setItem('snakeArrowsEnable', this._arrowsEnable);
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
        this._snake = new __WEBPACK_IMPORTED_MODULE_2__snake__["a" /* default */]();

        let start = [Math.ceil(this._field.sizeX / 2), Math.ceil(this._field.sizeY / 2)];
        let end = [start[0], start[1] - 1];

        this._snake.init(start, end);
        if (config !== null) {
            config.forEach(item => {
                let wall = new __WEBPACK_IMPORTED_MODULE_1__wall__["a" /* default */]();
                wall.start = item.start;
                wall.end = item.end;
                this._field.addItem(wall);
            });
        }
        this._field.addItem(this._snake);
        let rabbit = new __WEBPACK_IMPORTED_MODULE_0__rabbit__["a" /* default */](this._foodLifeTime);
        this._field.addItem(rabbit);
        this.render();
        if (!restart)
            this._bindEvents();

        this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
        this._generatorCounter = this._generatorFrequency;
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
        this._lastKey = null;
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
            let rabbit = new __WEBPACK_IMPORTED_MODULE_0__rabbit__["a" /* default */](this._foodLifeTime);
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

    _bindEvents() {
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('click', this._onClick);
    }

    _onKeyUp(event) {
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
        else if (event.keyCode === 72 || event.keyCode === 27) { // help
            this._showHelp = !this._showHelp;

            document.getElementById('help').className = 'help' + (this._showHelp ? '' : ' help_hidden');
            document.getElementById('snake-help').className = 'push-button push-button_small' + (this._showHelp ? ' push-button_active' : '');
            if (!this._pause)
                this._togglePause(true);
        }
        this._lastKey = event.keyCode;
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
            this._lastKey = 37;
        else if (y < rect.y && ((deltaYT > deltaXL && angle === 0) || (deltaYT > deltaXR && angle === 2))) // top
            this._lastKey = 38;
        else if (x > rectXRight && ((deltaXR > deltaYT && angle === 1) || (deltaXR > deltaYB && angle === 3))) // right
            this._lastKey = 39;
        else if (y > rectYBottom && ((deltaYB > deltaXL && angle === 0) || (deltaYB > deltaXR && angle === 2))) // bottom
            this._lastKey = 40;
    }

    _togglePause(ignoreFlag = false) {
        if (this._iterationTimer) {
            clearTimeout(this._iterationTimer);
            this._iterationTimer = null;
            document.getElementById('pause').innerHTML = 'PAUSE';
            document.getElementById('snake-pause').className = 'push-button push-button_big push-button_active';
            if (!ignoreFlag)
                this._pause = true;
        }
        else {
            this._iterationTimer = setTimeout(this.nextIteration, this._timeout());
            document.getElementById('pause').innerHTML = '';
            document.getElementById('snake-pause').className = 'push-button push-button_big';
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
        document.getElementById('snake-arrows-enable').addEventListener('click', () => this.arrowsEnable = !this.arrowsEnable);
        document.getElementById('snake-pause').addEventListener('click', () => this._onKeyUp({keyCode: 32}));
        document.getElementById('snake-reset').addEventListener('click', () => this._onKeyUp({keyCode: 13}));
        document.getElementById('snake-left').addEventListener('click', () => {
            if (this.arrowsEnable) {
                this._lastKey = 37;
            }
        });
        document.getElementById('snake-up').addEventListener('click', () => {
            if (this.arrowsEnable)
                this._lastKey = 38;
        });
        document.getElementById('snake-right').addEventListener('click', () => {
            if (this.arrowsEnable)
                this._lastKey = 39;
        });
        document.getElementById('snake-down').addEventListener('click', () => {
            if (this.arrowsEnable)
                this._lastKey = 40;
        });
        document.getElementById('snake-help').addEventListener('click', () => this._onKeyUp({keyCode: 27}));
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
    constructor(lifeTime = 20) {
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



/***/ })
/******/ ]);
//# sourceMappingURL=snake.js.map