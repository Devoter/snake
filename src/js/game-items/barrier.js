import mix from '../utils/mix';
import Wall from './wall';
import MovableMixin from './movable-mixin';

export default class Barrier extends mix(Wall).with(MovableMixin) {
    /**
     * Movement pattern
     *
     * @type {Array}
     * @private
     */
    _pattern = [];
    /**
     * Movement iteration
     *
     * @type {number}
     * @private
     */
    _iteration = 0;

    get pattern() {
        return this._pattern;
    }

    /**
     *
     * @param {Array<[<number>, <number>]>} pattern
     */
    set pattern(pattern) {
        this._pattern = [];
        for (let i = 0; i < pattern.length; ++i) {
            const step = pattern[i];
            this._pattern.push([step[0], step[1]]);
        }
        this._updatePoints();
    }

    moveNext(field) {
        const movement = this._pattern[this._iteration];
        this._start = [this._start[0] + movement[0], this._start[1] + movement[1]];
        this._end = [this._end[0] + movement[0], this._end[1] + movement[1]];
        this._updatePoints();

        ++this._iteration;
        if (this._iteration === this._pattern.length)
            this._iteration = 0;

        const points = this._points;

        for (let i = 0; i < field.items.length; ++i) {
            const item = field.items[i];
            if (!item.isFood || item === this)
                continue;

            const itemPoints = item.points;

            for (let j = 0; j < itemPoints.length; ++j) {
                for (let k = 0; k < points.length; ++k) {
                    if (itemPoints[j][0] === points[k][0] && itemPoints[j][1] === points[k][1]) {
                        item.lifeTime = 0;
                        break;
                    }
                }
            }
        }

        return 1;
    }

    place() {
        if (!this._connected && this.initialized()) {
            this._connected = true;
            return true;
        }

        return false;
    }
}
