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
        return 1;
    }
};

export default MovableMixin;
