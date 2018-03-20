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
