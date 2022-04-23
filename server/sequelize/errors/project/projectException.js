class ProjectCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "ProjectCommonError";
    }
}

class ProjectCredentialsError extends ProjectCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "ProjectCredentialsError";
    }
}

class ProjectSameCredentialsError extends ProjectCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "ProjectSameCredentialsError";
    }
}

class ProjectNotUpdatedDataError extends ProjectCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "ProjectNotUpdatedDataError";
    }
}

class ProjectDeletionError extends ProjectCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "ProjectDeletionError";
    }
}

class ProjectNotFoundError extends ProjectCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "ProjectNotFoundError";
    }
}

class ProjectTransactionError extends ProjectCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "ProjectTransactionError";
    }
}

module.exports = {
    ProjectCommonError,
    ProjectCredentialsError,
    ProjectSameCredentialsError,
    ProjectNotUpdatedDataError,
    ProjectDeletionError,
    ProjectNotFoundError,
    ProjectTransactionError
}