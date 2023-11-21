class AccessDeniedError extends Error {
    constructor(message) {
        super(message);
        this.code = 401;
    }
}

module.exports = AccessDeniedError;