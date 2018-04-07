import {sha256} from 'js-sha256';

export default class Adapter {
    constructor(host, port) {
        this._hostUrl = host + ':' + port + '/';
    }

    async saveScore(name, score) {
        let checksum = sha256(name + score);
        for (let i = 0; i < 1000; ++i)
            checksum = sha256(checksum);

        const data = new FormData();
        data.append('json', JSON.stringify({name: name, score: score, hash: checksum}));
        let scoreTable;
        try {
            const response = await fetch(this._hostUrl, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            scoreTable = response.json();
        }
        catch (reason) {
            console.log('Could not save score by the reason', reason);
            return null;
        }

        return scoreTable;
    }

    async updateScoreTable() {
        let scoreTable;
        try {
            const response = await fetch(this._hostUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            scoreTable = response.json();
        }
        catch (reason) {
            console.log('Could not load score table by the reason', reason);
            return null;
        }

        return scoreTable;
    }
}
