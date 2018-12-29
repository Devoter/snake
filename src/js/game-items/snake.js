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

    move(field, condition, boost = false, deltaX = 0, deltaY = 0) {
        const head = this._points[this._points.length - 1];
        const boostUp = boost ? 2 : 1;
        const newHead = [];
        let moved = 1;

        if (boost) { // calculating a long head
            if (deltaX)
                for (let i = deltaX; i !== deltaX * boostUp; i += deltaX)
                    newHead.push([head[0] + i, head[1]]);
            else
                for (let i = deltaY; i !== deltaY * boostUp; i += deltaY)
                    newHead.push([head[0], head[1] + i]);
        }
        newHead.push([head[0] + deltaX * boostUp, head[1] + deltaY * boostUp]);

        if (!condition(newHead[newHead.length - 1], field.sizeX, field.sizeY))
            moved = 0;
        else {
            const newBody = this._points.slice(this._grow ? (boostUp - 1) : boostUp, this._points.length);

            for (let i = 0; i < field.items.length && moved === 1; ++i) {
                const item = field.items[i];
                const points = item.points;

                for (let j = 0; j < points.length; ++j) {
                    let alreadyMoved = false;
                    for (let k = 0; k < newHead.length; ++k) {
                        if (points[j][0] === newHead[k][0] && points[j][1] === newHead[k][1]) {
                            if (item === this && j === points.length - 2)
                                moved = 3;
                            else if (item.isFood) {
                                moved = 2;
                                item.eaten = true;
                            }
                            else
                                moved = 0;

                            alreadyMoved = true;
                            break;
                        }
                    }
                    if (alreadyMoved)
                        break;

                    if (item !== this) {
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
            if (this._grow) {
                this._grow = false;
                this._points.splice(0, boostUp - 1);
            }
            else
                this._points.splice(0, boostUp);
            this._points = this._points.concat(newHead);
        }

        return moved;
    }

    moveNext(field, boost) {
        switch (this._angle) {
            case 0:
                return this.moveLeft(field, boost);
            case 1:
                return this.moveUp(field, boost);
            case 2:
                return this.moveRight(field, boost);
            case 3:
                return this.moveDown(field, boost);
        }
        return 1;
    }

    moveLeft(field, boost) {
        const moved = this.move(field, head => head[0] >= 0, boost , -1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 0;
        return moved;
    }

    moveRight(field, boost) {
        const moved = this.move(field, (head, sizeX) => head[0] < sizeX, boost, 1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 2;
        return moved;
    }

    moveUp(field, boost) {
        const moved = this.move(field, head => head[1] >= 0, boost, 0, -1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 1;
        return moved;
    }

    moveDown(field, boost) {
        const moved = this.move(field, (head, sizeX, sizeY) => head[1] < sizeY, boost, 0, 1);
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
