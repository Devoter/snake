export default class GameItem {
    _connected = false;

    /**
     *
     * @return {boolean}
     */
    get isFood() {
        return false;
    }

    /**
     *
     * @return {boolean}
     */
    get movable() {
        return false;
    }

    /**
     *
     * @return {Array<[<number>,<number>]>}
     */
    get points() {
        return [[-1, -1]];
    }

    /**
     *
     * @return {boolean}
     */
    connected() {
        return this._connected;
    }

    disconnect() {
        this._connected = false;
    }

    /**
     * @abstract
     * @return {boolean}
     */
    initialized() {
        throw new Error('Method is not implemented');
    }

    /**
     *
     * @abstract
     * @param field
     * @return {boolean}
     */
    place(field) { // eslint-disable-line no-unused-vars
        throw new Error('Method is not implemented');
    }
}
