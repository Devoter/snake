const levels = [
    {
        speed: 0,
        score: 100,
        items: []
    },
    {
        speed: 0,
        score: 150,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [2, 2]
            },
            {
                type: 'wall',
                start: [7, 1],
                end: [8, 2]
            }
        ]
    },
    {
        speed: 0,
        score: 200,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [2, 2]
            },
            {
                type: 'wall',
                start: [7, 1],
                end: [8, 2]
            },
            {
                type: 'wall',
                start: [1, 17],
                end: [2, 18]
            },
            {
                type: 'wall',
                start: [7, 17],
                end: [8, 18]
            }
        ]
    },
    {
        speed: 0,
        score: 250,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [1, 4]
            },
            {
                type: 'wall',
                start: [2, 1],
                end: [4, 1]
            },
            {
                type: 'wall',
                start: [3, 3],
                end: [4, 4]
            },
            {
                type: 'wall',
                start: [4, 18],
                end: [7, 18]
            },
            {
                type: 'wall',
                start: [8, 15],
                end: [8, 18]
            },
            {
                type: 'wall',
                start: [5, 15],
                end: [6, 16]
            }
        ]
    },
    {
        speed: 0,
        score: 300,
        items: [
            {
                type: 'wall',
                start: [1, 1],
                end: [1, 10]
            },
            {
                type: 'wall',
                start: [2, 1],
                end: [4, 1]
            },
            {
                type: 'wall',
                start: [3, 3],
                end: [4, 6]
            },
            {
                type: 'wall',
                start: [2, 18],
                end: [7, 17]
            },
            {
                type: 'wall',
                start: [8, 12],
                end: [8, 18]
            },
            {
                type: 'wall',
                start: [9, 0],
                end: [9, 2]
            }
        ]
    },
    {
        speed: 0,
        score: 350,
        items: [
            {
                type: 'wall',
                start: [0, 3],
                end: [1, 3]
            },
            {
                type: 'wall',
                start: [0, 14],
                end: [5, 14]
            },
            {
                type: 'wall',
                start: [2, 6],
                end: [2, 11]
            },
            {
                type: 'wall',
                start: [3, 6],
                end: [4, 6]
            },
            {
                type: 'wall',
                start: [3, 11],
                end: [6, 11]
            },
            {
                type: 'wall',
                start: [4, 3],
                end: [6, 3]
            },
            {
                type: 'wall',
                start: [7, 3],
                end: [7, 11]
            },
            {
                type: 'wall',
                start: [4, 17],
                end: [7, 19]
            },
            {
                type: 'wall',
                start: [8, 14],
                end: [9, 14]
            }
        ]
    }
];

export default levels;
