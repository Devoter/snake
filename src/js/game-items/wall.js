import GameItem from './game-item';

export default class Wall extends GameItem {
    _points = [];
    _start = [-1, -1];
    _end = [-1, -1];

    get points() {
        return this._points;
    }

    get space() {
        return this._points;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    set start(point) {
        this._start = [point[0], point[1]];
        this._updatePoints();
    }

    set end(point) {
        this._end = [point[0], point[1]];
        this._updatePoints();
    }

    initialized() {
        return this._points.length;
    }

    place(field) { // eslint-disable-line no-unused-vars
        if (!this._connected && this.initialized()) {
            this._connected = true;
            return true;
        }

        return false;
    }

    _updatePoints() {
        const start = this._start;
        const end = this._end;

        if (start[0] === -1 || start[1] === -1 || end[0] === -1 || end[1] === -1) {
            this._points = [];
            return;
        }

        const points = [];

        for (let x = Math.min(start[0], end[0]); x <= Math.max(start[0], end[0]); ++x) {
            for (let y = Math.min(start[1], end[1]); y <= Math.max(start[1], end[1]); ++y)
                points.push([x, y]);
        }

        this._points = points;
    }
}
