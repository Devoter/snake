import GameItem from './game-item';

export default class Field {
    constructor(sizeX, sizeY) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._items = [];
        this._count = 0;
        this._maxCount = this._sizeX * this._sizeY;
        this._previousTable = null;
    }

    get items() {
        return this._items.slice();
    }

    table() {
        let tableDiff = [], t = [];

        for (let x = 0; x < this._sizeX; ++x)
            t.push(new Array(this._sizeY).fill(false));

        if (this._previousTable) {
            for (let i = 0; i < this._items.length; ++i) {
                let item = this._items[i];
                let points = item.points;
                for (let j = 0; j < points.length; ++j) {
                    let point = points[j];
                    t[point[0]][point[1]] = !(item.isFood && item.lifeTime < 6 && item.lifeTime % 2 !== 0);
                }
            }
            for (let i = 0; i < t.length; ++i) {
                for (let j = 0; j < t[i].length; ++j) {
                    let value = t[i][j];
                    if (this._previousTable[i][j] !== value)
                        tableDiff.push({ x: i, y: j, value: value });
                }
            }
        }
        else {
            for (let i = 0; i < this._items.length; ++i) {
                let item = this._items[i];
                let points = item.points;
                for (let j = 0; j < points.length; ++j) {
                    let point = points[j];
                    let draw = !(item.isFood && item.lifeTime < 6 && item.lifeTime % 2 !== 0);
                    if (draw)
                        tableDiff.push({ x: point[0], y: point[1], value: true });
                    t[point[0]][point[1]] = draw;
                }
            }
        }

        this._previousTable = t;

        return tableDiff;
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
        if (!(item instanceof GameItem) || !this.available() || this._items.findIndex(i => i === item) !== -1 || !item.place(this))
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
