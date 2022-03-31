const {Op} = require("sequelize");

const {ProjectSameCredentialsError} = require("../../errors/project/projectException");

async function validateSameProjectData({userId, projectName, projectNameUser}, isEdition = false) {
    let messages = [];
    let sameProject = "";
    if (isEdition) {
        sameProject = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        userId: userId
                    },
                    {
                        name: projectName
                    },
                    {
                        name: {
                            [Op.ne]: projectNameUser
                        }
                    }
                ]
            }
        });
    } else {
        sameProject = await this.findOne({
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
    }
    if (sameProject) {
        messages.push({
            text: "Проект с таким названием у Вас уже есть!"
        });
    }
    if (messages.length > 0) {
        throw new ProjectSameCredentialsError("Project with such data is already in database", messages);
    }
}

module.exports = {
    validateSameProjectData
};