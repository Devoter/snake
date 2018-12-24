import encrypt from './encrypt';

export default class Adapter {
    /**
     * @property {string}
     * @private
     */
    _hostUrl;

    constructor(host, port) {
        this._hostUrl = host + ':' + port + '/';
    }

    async saveScore(name, score) {
        const data = JSON.stringify({name: name, score: score, hash: encrypt(name, score)});
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
            scoreTable = await response.json();
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
