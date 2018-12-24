# Retro Snake

Simple web-based Retro Snake game. [Demo](https://devoter.github.io/snake/).

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
| `P` | `SPACE`       | Pause       |
| `R` | `ENTER`       | Restart     |
| `H` | `ESCAPE`      | Help        |
| `C` |               | Color mode  |
| `V` |               | Vibration   |
| `T` |               | Score table |
