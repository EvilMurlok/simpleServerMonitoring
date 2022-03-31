const {models} = require("../../sequelize");

const {ProjectNotUpdatedDataError} = require("../../sequelize/errors/project/projectException");

const create_project = async (req, res) => {
    const userId = req.user.id;
    const {projectName} = req.body;
    try {
        const createdProject = await models.project.createProject({userId, projectName});
        res.send({
            status: "success",
            messages: [{
                text: `Проект ${createdProject.name} успешно создан!`
            }],
            project: createdProject
        });
    } catch (e) {
        res.send({
            status: "danger",
            messages: e.messages
        });
    }
}

const edit_project = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const {projectName} = req.body;
    try {
        const updatedProject = await models.project.editProject({userId, projectId, projectName});
        res.send({
            status: "success",
            messages: [{
                text: "Данные о проекте успешно изменены!"
            }],
            project: updatedProject
        });
    } catch (e) {
        if (e instanceof ProjectNotUpdatedDataError){
            res.send({
                status: "info",
                messages: e.messages
            });
        } else {
            res.send({
                status: "danger",
                messages: e.messages
            });
        }
    }
}

const retrieve_user_projects = async (req, res) => {
    const userId = req.user.id;
    try {
        const userProjects = await models.project.retrieveUserProjects({userId});
        res.send({
            status: "success",
            userProjects: userProjects,
        });
    } catch (e) {
        res.send({
            status: "danger",
            messages: e.messages
        });
    }
}

const delete_project = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    try {
        const numberOfDeletedProjects = await models.project.deleteProject({userId, projectId});
        res.send({
            status: "success",
            messages: [{
                text: "Проект успешно удален!"
            }],
            numberOfDeletedProjects: numberOfDeletedProjects
        });
    } catch (e) {
        res.send({
            status: "danger",
            messages: e.messages
        });
    }
}

module.exports = {
    create_project,
    edit_project,
    retrieve_user_projects,
    delete_project
};