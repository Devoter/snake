import GameItem from './game-item';

export default class Food extends GameItem {
    _lifeTime = 25;
    _eaten = false;

    constructor(lifeTime = 25) {
        super();
        this._lifeTime = lifeTime;
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
