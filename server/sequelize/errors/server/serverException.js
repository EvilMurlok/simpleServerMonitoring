class ServerCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "ServerCommonError";
    }
}

class ServerCredentialsError extends ServerCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "ServerCredentialsError";
    }
}

class ServerSameCredentialsError extends ServerCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "ServerSameCredentialsError";
    }
}

class ServerNotFoundError extends ServerCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "ServerNotFoundError";
    }
}

class ServerNotUpdatedError extends ServerCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "ServerNotUpdatedError";
    }
}

class ServerDeletionError extends ServerCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "ServerDeletionError";
    }
}

class ServerTransactionError extends ServerCommonError {
    constructor(message, messages) {
        super(message, messages);
        this.name = "ServerTransactionError";
    }
}


module.exports = {
    ServerCommonError,
    ServerNotUpdatedError,
    ServerDeletionError,
    ServerSameCredentialsError,
    ServerCredentialsError,
    ServerNotFoundError,
    ServerTransactionError
}