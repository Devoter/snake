const levels = [
    {
        speed: 0,
        score: 50,
        items: []
    },
    {
        speed: 0,
        score: 100,
        items: []
    },
    {
        speed: 0,
        score: 200,
        items: []
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
    }
];

export default levels;
