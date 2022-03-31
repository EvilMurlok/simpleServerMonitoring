const {ServerCredentialsError} = require("../../errors/server/serverException");

async function validateServerData({hostname, ip}) {
    let messages = [];
    let [
        rightHostname,
        rightIp,
    ] = [
        /^[a-zA-Z0-9_]{3,255}$/,
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ];
    if (!hostname) {
        messages.push(
            {
                text: "Поле имени хоста обязательно для заполнения!"
            }
        );
    }
    if (!ip) {
        messages.push(
            {
                text: "Поле ip обязательно для заполнения!"
            }
        );
    }
    if (hostname && !rightHostname.test(hostname)) {
        messages.push(
            {
                text: "Имя хоста должно состоять только из латинских букв, цифр, символов подчеркивания длиной 3-255 символов!"
            }
        );
    }
    if (ip && !rightIp.test(ip)) {
        messages.push(
            {
                text: "Неверный формат ip-адреса!"
            }
        );
    }
    if (messages.length > 0) {
        throw new ServerCredentialsError("Invalid Server Credentials", messages);
    }
}


module.exports = {
    validateServerData
}