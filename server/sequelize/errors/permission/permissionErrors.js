class PermissionCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "PermissionCommonError";
    }
}

class PermissionCredentialsError extends PermissionCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "PermissionCredentialsError";
    }
}

class PermissionSameCredentialsError extends PermissionCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "PermissionSameCredentialsError";
    }
}

class PermissionInheritanceError extends PermissionCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "PermissionInheritanceError";
    }
}

class PermissionNotFoundError extends PermissionCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "PermissionNotFoundError";
    }
}

class PermissionAccessDeniedError extends PermissionCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "PermissionAccessDeniedError";
    }
}

class PermissionTransactionError extends PermissionCommonError {
    constructor (message, messages) {
        super(message, messages);
        this.name = "PermissionTransactionError";
    }
}

module.exports = {
    PermissionCommonError,
    PermissionCredentialsError,
    PermissionSameCredentialsError,
    PermissionInheritanceError,
    PermissionNotFoundError,
    PermissionAccessDeniedError,
    PermissionTransactionError
}
