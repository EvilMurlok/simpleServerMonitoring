const {Op} = require("sequelize");

async function validateSameProjectData({userId, projectName}) {
    let messages = [];
    const sameProject = await this.findOne({
        where: {
            [Op.and]: [
                {
                    userId: userId
                },
                {
                    name: projectName
                }
            ]
        }
    });
    if (sameProject) {
        messages.push({
            text: "Проект с таким названием у Вас уже есть!"
        });
    }
    return messages;
}

module.exports = {
    validateSameProjectData
};