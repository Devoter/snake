import GameItem from './game-item';

export default class Food extends GameItem {
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
