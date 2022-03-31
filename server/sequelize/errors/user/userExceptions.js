class UserCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "UserCommonError";
    }
}

class UserCredentialsError extends UserCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "UserCredentialsError";
    }
}

class UserSameCredentialsError extends UserCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "UserSameCredentialsError";
    }
}

class UserNotUpdatedDataError extends UserCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "UserNotUpdatedDataError";
    }
}

class UserNotFoundError extends UserCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "UserNotFoundError";
    }
}

class UserDeletionError extends UserCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "UserDeletionError";
    }
}

module.exports = {
    UserCredentialsError,
    UserSameCredentialsError,
    UserNotUpdatedDataError,
    UserNotFoundError,
    UserDeletionError
}

