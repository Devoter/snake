import Food from './food';

export default class Rabbit extends Food {
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

        if (this.initialized())
            return !(field.items.some(item => item.points.some(point => point[0] === this._x && point[1] === this._y)));

        const cells = field.freeCells();
        if (!cells)
            return false;

        let i = cells[Math.floor(Math.random() * cells.length)];
        this.y = Math.floor(i / field.sizeX);
        this.x = i % field.sizeX;

        this._connected = true;
        return true;
    }
}
