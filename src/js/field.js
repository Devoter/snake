import GameItem from './game-item';

export default class Field {
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
