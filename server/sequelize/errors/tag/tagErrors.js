class TagCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "TagCommonError";
    }
}

class TagCredentialsError extends TagCommonError {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "TagCredentialsError";
    }
}

class TagSameCredentialsError extends TagCommonError {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "TagSameCredentialsError";
    }
}

module.exports = {
    TagCredentialsError,
    TagSameCredentialsError
}
