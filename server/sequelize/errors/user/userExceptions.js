class UserCredentialsError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "UserCredentialsError";
    }
}

class UserSameCredentialsError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "UserSameCredentialsError";
    }
}

module.exports = {
    UserCredentialsError,
    UserSameCredentialsError
}

