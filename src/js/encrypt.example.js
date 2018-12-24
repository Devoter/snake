import {sha256} from 'js-sha256';

export default function encrypt(name, score) {
    return sha256(name + score);
}
