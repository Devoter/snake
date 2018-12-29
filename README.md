# Retro Snake

Web-based Retro Snake game. [Demo](https://devoter.github.io/snake/), [server backend project](https://github.com/Devoter/snake_server).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`

## Hash

Hash is required for the server requests. You may use your own hash function or copy the default implementation.

```sh
cp js/encrypt.example.js js/encrypt.js
```

## Production build

* `npm run build`

## Run at localhost

* `npm run start`

Open URL `http://localhost:8080/` and enjoy.


## Controls

| Key |  Alternative  |   Action    |
|-----|---------------|-------------|
| `W` | `ARROW UP`    | Move up     |
| `S` | `ARROW DOWN`  | Move down   |
| `A` | `ARROW LEFT`  | Move left   |
| `D` | `ARROW RIGHT` | Move right  |
|     | `SPACE`       | Throw       |
| `P` | `ESCAPE`      | Pause       |
| `R` | `ENTER`       | Restart     |
| `H` |               | Help        |
| `C` |               | Color mode  |
| `V` |               | Vibration   |
| `T` |               | Score table |


## Levels

All levels located into `src/js/levels.js` file. Field size is 10x20.

Format:
```js
module.exports = [
    {
        speed: 0,
        score: 100,
        items: [
            {
                type: 'barrier',
                start: [4, 5],
                end: [5, 5],
                pattern: [
                    [1, 0],
                    [1, 0],
                    [-1, 0],
                    [-1, 0]
                ]
            },
            {
                type: 'wall',
                start: [0, 4],
                end: [1, 5]
            }
        ]
    }
];
```

* **number** `speed` - start speed
* **number** `score` - minimum score to level up
* **Array** `items` - items list (please read below)
* **string** `items[{type}]` - item type (`wall` or `barrier`)

### Wall item

Wall item is just a wall. If the snake touches the wall the game end.

* **string** `type` - `'wall'`
* **[number, number]** `start` - wall start coordinates
* **[number, number]** `end` - wall end coordinates

The wall is a filled rectangle. If you want to draw a blank rectangle, then you need to combine four wall items.

### Barrier

Barrier is a moving wall.

* **string** `type` - `'wall'`
* **[number, number]** `start` - wall start coordinates
* **[number, number]** `end` - wall end coordinates
* **Array<[number, number]>** `pattern` - motion pattern cycle

Each element of the motion pattern is an increment of the current barrier coordinates. The movement is cyclic, so be careful when creating a pattern.

## License

[MIT](LICENSE)
