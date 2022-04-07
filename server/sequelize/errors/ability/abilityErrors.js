class AbilityCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "AbilityCommonError";
    }
}

class AbilityCredentialsError extends AbilityCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "TagCredentialsError";
    }
}

class AbilitySameCredentialsError extends AbilityCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "TagSameCredentialsError";
    }
}

module.exports = {
    AbilityCredentialsError,
    AbilitySameCredentialsError
}
