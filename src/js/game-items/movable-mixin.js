const MovableMixin = superclass => class extends superclass {
    get movable() {
        return true;
    }

    /**
     *
     * @type {Function}
     * @abstract
     * @param {Field} field
     * @return {number}
     */
    moveNext(field) { // eslint-disable-line no-unused-vars
        throw new Error('Method is not implemented');
    }
};

export default MovableMixin;
