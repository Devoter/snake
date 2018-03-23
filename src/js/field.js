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
        let tableDiff = [];
        let t = new Array(this._maxCount).fill(false);
        const sizeX = this._sizeX;
        const sizeY = this._sizeY;

        if (this._previousTable) {
            for (let i = 0; i < this._items.length; ++i) {
                let item = this._items[i];
                let points = item.points;
                for (let j = 0; j < points.length; ++j) {
                    let point = points[j];
                    let index = sizeX * point[1] + point[0];
                    t[index] = !(item.isFood && item.lifeTime < 6 && item.lifeTime % 2 !== 0);
                }
            }
            for (let x = 0; x < sizeX; ++x) {
                for (let y = 0; y < sizeY; ++y) {
                    let i = sizeX * y + x;
                    let value = t[i];
                    if (this._previousTable[i] !== value)
                        tableDiff.push({ x: x, y: y, value: value });
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

    freeCells() {
        if (!this._previousTable)
            return null;

        const t = this._previousTable;
        let cells = [];
        for (let i = 0; i < t.length; ++i) {
            if (!t[i])
                cells.push(i);
        }

        return cells;
    }
}
