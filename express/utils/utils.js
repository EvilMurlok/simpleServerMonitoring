const crypto = require("crypto");

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}

module.exports = getHashedPassword;