import GameItem from './game-items/game-item';
import Snake from './game-items/snake';

export default class Field {
    _sizeX = 0;
    _sizeY = 0;
    _items = [];
    _count = 0;
    _maxCount = 0;
    _previousTable = null;

    constructor(sizeX, sizeY) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._maxCount = this._sizeX * this._sizeY;
    }

    get items() {
        return this._items.slice();
    }

    table() {
        const tableDiff = [];
        const t = new Array(this._maxCount).fill(0);
        const sizeX = this._sizeX;
        const sizeY = this._sizeY;

        if (this._previousTable) {
            for (let i = 0; i < this._items.length; ++i) {
                const item = this._items[i];
                const points = item.points;
                for (let j = 0; j < points.length; ++j) {
                    const point = points[j];
                    const index = sizeX * point[1] + point[0];
                    if (item.isFood)
                        t[index] = (item.lifeTime < 6 && item.lifeTime % 2 !== 0) ? 4 : 1;
                    else if (item instanceof Snake)
                        t[index] = 2;
                    else
                        t[index] = 3;
                }
            }
            for (let x = 0; x < sizeX; ++x) {
                for (let y = 0; y < sizeY; ++y) {
                    const i = sizeX * y + x;
                    const value = t[i];
                    if (this._previousTable[i] !== value)
                        tableDiff.push({x: x, y: y, value: value});
                }
            }
        }
        else {
            for (let i = 0; i < this._items.length; ++i) {
                const item = this._items[i];
                const points = item.points;
                for (let j = 0; j < points.length; ++j) {
                    const point = points[j];
                    let draw;
                    if (item.isFood)
                        draw = (item.lifeTime < 6 && item.lifeTime % 2 !== 0) ? 4 : 1;
                    else if (item instanceof Snake)
                        draw = 2;
                    else
                        draw = 3;

                    if (draw)
                        tableDiff.push({x: point[0], y: point[1], value: draw});
                    t[sizeX * point[1] + point[0]] = draw;
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
        const index = this._items.findIndex(i => i === item);
        if (index === -1)
            return;

        this._count -= item.points.length;
        this._items.splice(index, 1);
    }

    clear() {
        this._items = [];
        this._count = 0;
    }

    freeCells() {
        if (!this._previousTable)
            return null;

        const t = this._previousTable;
        const cells = [];
        for (let i = 0; i < t.length; ++i) {
            if (!t[i])
                cells.push(i);
        }

        return cells;
    }

    clearPreviousTable() {
        this._previousTable = null;
    }
}
