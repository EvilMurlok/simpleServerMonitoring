const {ProjectCredentialsError} = require('../../errors/project/projectException');

async function validateProjectData({projectName}) {
    let messages = [];
    let rightProjectName = /^[a-zA-Z0-9_-]{3,255}$/
    if (!projectName) {
        messages.push(
            {
                text: "Поле имени проекта обязательно для заполнения!"
            }
        );
    }
    if (projectName && !rightProjectName.test(projectName)) {
        messages.push(
            {
                text: "Имя проекта должно состоять только из латинских букв и цифр, символов подчеркивания и тире!"
            }
        );
    }
    if (messages.length > 0) {
        throw new ProjectCredentialsError("Invalid project data", messages);
    }
}

module.exports = {
    validateProjectData
};