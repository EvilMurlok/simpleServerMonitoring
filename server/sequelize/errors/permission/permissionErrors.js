class PermissionCommonError extends Error {
    constructor (message, messages) {
        super(message);
        this.messages = messages;
        this.name = "TagCommonError";
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

module.exports = {
    PermissionCredentialsError,
    PermissionSameCredentialsError
}
