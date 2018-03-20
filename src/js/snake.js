import GameItem from './game-item';

export default class Snake extends GameItem {
    constructor() {
        super();
        this._points = [];
        this._grow = false;
        this._angle = 0;
    }

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
        let head = this._points[this._points.length - 1];
        let newHead = [head[0] + deltaX, head[1] + deltaY];
        let moved = 1;
        if (!condition(newHead, field.sizeX, field.sizeY))
            moved = 0;
        else {
            for (let i = 0; i < field.items.length && moved === 1; ++i) {
                let item = field.items[i];
                let points = item.points;

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
        let moved = this.move(field, head => head[0] >= 0, -1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 0;
        return moved;
    }

    moveRight(field) {
        let moved = this.move(field, (head, sizeX) => head[0] < sizeX, 1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 2;
        return moved;
    }

    moveUp(field) {
        let moved = this.move(field, head => head[1] >= 0, 0, -1);
        if (moved === 3)
            return this.moveNext(field);
        
        this._angle = 1;
        return moved;
    }

    moveDown(field) {
        let moved = this.move(field, (head, sizeX, sizeY) => head[1] < sizeY, 0, 1);
        if (moved === 3)
            return this.moveNext(field);

        this._angle = 3;
        return moved;
    }

    initialized() {
        return this._points.length > 1;
    }

    place(field) {
        if (this.initialized()) {
            let placed = !field.items.some(item => item.points.some(point => this._points.some(p => p[0] === point[0] && p[1] === point[1])));

            if (placed)
                this._connected = true;

            return placed;
        }

        let placed = false;
        let counter = 0;
        let outOfCounter = field.sizeX * field.sizeY;

        do {
            if (counter >= outOfCounter)
                return false;

            let x1 = Math.floor(Math.random() * field.sizeX);
            let y1 = Math.floor(Math.random() * field.sizeY);
            let angle = Math.floor(Math.random() * 4);
            let x2, y2;
            switch(angle) {
                case 0:
                    x2 = x1 ? x1 - 1 : x1 + 1;
                    y2 = y1;
                    break;
                case 1:
                    x2 = x1;
                    y2 = y1 ? y1 - 1 : y1 + 1;
                    break;
                case 2:
                    x2 = x1 < (field.sizeX - 1) ? x1 + 1 : x1 - 1;
                    y2 = y1;
                    break;
                case 3:
                    x2 = x1;
                    y2 = y1 < (field.sizeY - 1) ? y1 + 1 : y1 - 1;
                    break;
            }
            
            if (field.items.some(item => item.points.some(point =>
                (point[0] === x1 && point[1] === y1) || (point[0] === x2 && point[1] === y2)))) {
                counter++;
                continue;
            }
            
            this._points = [[x1, y1], [x2, y2]];
            this._connected = true;
            placed = true;
        } while (!placed);

        return true;
    }
}
