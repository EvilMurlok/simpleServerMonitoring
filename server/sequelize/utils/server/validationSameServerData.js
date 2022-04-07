const {Op} = require("sequelize");

const {ServerSameCredentialsError} = require("../../errors/server/serverException");

async function validateSameServerData({projectId, hostname, ip, hostnameUser, ipUser}, isEdition = false) {
    let messages = [];
    let [sameHostname, sameIp] = ["", ""];
    if (isEdition) {
        sameHostname = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        projectId: projectId
                    },
                    {
                        hostname: hostname
                    },
                    {
                        hostname: {
                            [Op.ne]: hostnameUser
                        }
                    },
                    {
                        deleted: {
                            [Op.is]: null
                        }
                    }
                ]
            }
        });
        sameIp = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        ip: ip
                    },
                    {
                        ip: {
                            [Op.ne]: ipUser
                        }
                    },
                    {
                        deleted: {
                            [Op.is]: null
                        }
                    }
                ]
            }
        });
    } else {
        sameHostname = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        projectId: projectId
                    },
                    {
                        hostname: hostname
                    },
                    {
                        deleted: {
                            [Op.is]: null
                        }
                    }
                ]
            }
        });
        sameIp = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        ip: ip
                    },
                    {
                        deleted: {
                            [Op.is]: null
                        }
                    }
                ]
            }
        });
    }
    if (sameHostname) {
        messages.push({
            text: "Сервер с таким именем хоста уже добавлен в этот проект!"
        });
    }
    if (sameIp) {
        messages.push({
            text: "Сервер с таким ip уже используется. Проверьте введенные данные!"
        });
    }
    if (messages.length > 0) {
        throw new ServerSameCredentialsError("Server with such data is already in database", messages);
    }
}

module.exports = {
    validateSameServerData
}