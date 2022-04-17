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

class TagNotUpdatedError extends TagCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "TagNotUpdatedError";
    }
}

class TagDeletionError extends TagCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "TagDeletionError";
    }
}

module.exports = {
    TagCredentialsError,
    TagSameCredentialsError,
    TagNotUpdatedError,
    TagDeletionError
}
