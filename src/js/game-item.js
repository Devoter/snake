export default class GameItem {
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
