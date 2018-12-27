import mix from '../utils/mix';
import GameItem from './game-item';
import MovableMixin from './movable-mixin';

export default class Snake extends mix(GameItem).with(MovableMixin) {
    _points = [];
    _grow = false;
    _angle = 0;

    get points() {
        return this._points;
    }

    get angle() {
        return this._angle;
    }

    init(start, end) {
        if (!(start instanceof Array) || !(end instanceof Array) || start.length !== 2 || end.length !== 2)
            return;

        this._points.push(start);
        this._points.push(end);

        if (start[0] < end[0])
            this._angle = 2;
        else if (start[0] > end[0])
            this._angle = 0;
        else if (start[1] < end[1])
            this._angle = 3;
        else
            this._angle = 1;
    }

    grow() {
        this._grow = true;
    }

    move(field, condition, deltaX = 0, deltaY = 0) {
        const head = this._points[this._points.length - 1];
        const newHead = [head[0] + deltaX, head[1] + deltaY];
        let moved = 1;
        if (!condition(newHead, field.sizeX, field.sizeY))
            moved = 0;
        else {
            const newBody = this._points.slice(1, this._points.length);

            for (let i = 0; i < field.items.length && moved === 1; ++i) {
                const item = field.items[i];
                const points = item.points;

                for (let j = 0; j < points.length; ++j) {

                    if (points[j][0] === newHead[0] && points[j][1] === newHead[1]) {
                        if (item === this && j === points.length - 2)
                            moved = 3;
                        else if (item.isFood) {
                            moved = 2;
                            item.eaten = true;
                        }
                        else
                            moved = 0;
                        break;
                    }
                    else if (item !== this) {
                        for (let k = 0; k < newBody.length; ++k) {
                            if (points[j][0] === newBody[k][0] && points[j][1] === newBody[k][1]) {
                                moved = 0;
                                break;
                            }
                        }

                        if (moved === 0)
                            break;
                    }
                }
            }
        }

        if (moved && moved !== 3) {
            if (this._grow)
                this._grow = false;
            else
                this._points.splice(0, 1);
            this._points.push(newHead);
        }

        return moved;
    }

    moveNext(field) {
        switch (this._angle) {
            case 0:
                return this.moveLeft(field);
            case 1:
                return this.moveUp(field);
            case 2:
                return this.moveRight(field);
            case 3:
                return this.moveDown(field);
        }
        return 1;
    }

    moveLeft(field) {
        const moved = this.move(field, head => head[0] >= 0, -1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 0;
        return moved;
    }

    moveRight(field) {
        const moved = this.move(field, (head, sizeX) => head[0] < sizeX, 1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 2;
        return moved;
    }

    moveUp(field) {
        const moved = this.move(field, head => head[1] >= 0, 0, -1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 1;
        return moved;
    }

    moveDown(field) {
        const moved = this.move(field, (head, sizeX, sizeY) => head[1] < sizeY, 0, 1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 3;
        return moved;
    }

    initialized() {
        return this._points.length > 1;
    }

    place(field) {
        if (!this.initialized())
            return false;
        const placed = !field.items.some(item => item.points.some(point =>
            this._points.some(p => p[0] === point[0] && p[1] === point[1])));

        if (placed)
            this._connected = true;

        return placed;
    }
}
