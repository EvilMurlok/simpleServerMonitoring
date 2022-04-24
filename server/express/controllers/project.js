const {models} = require("../../sequelize");

const {ProjectNotUpdatedDataError, ProjectNotFoundError} = require("../../sequelize/errors/project/projectException");

const create_project = async (req, res) => {
    const {projectName} = req.body;
    const userId = req.user.id;
    console.log(userId);
    try {
        const createdProject = await models.project.createProject({userId, projectName});
        res.send({
            status: "success",
            messages: [{
                text: `Проект ${createdProject.name} успешно создан! Вы получили права администратора на него!`
            }],
            project: createdProject
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const edit_project = async (req, res) => {
    const projectId = req.params.projectId;
    const {projectName} = req.body;
    try {
        const [,updatedProject] = await models.project.editProject({projectId, projectName});
        res.send({
            status: "success",
            messages: [{
                text: "Данные о проекте успешно изменены!"
            }],
            project: updatedProject
        });
    } catch (e) {
        if (e instanceof ProjectNotUpdatedDataError) {
            res.send({
                status: "info",
                messages: e.messages
            });
        } else if (e instanceof ProjectNotFoundError) {
            res.send({
                status: "not found",
                messages: e.messages
            });
        } else {
            res.send({
                status: "warning",
                messages: e.messages
            });
        }
    }
}

const retrieve_user_projects = async (req, res) => {
    const [userId, offset, limit] = [req.user.id, req.params.offset, req.params.limit];
    try {
        const userProjects = await models.project.retrieveUserProjects({userId, offset, limit});
        res.send({
            status: "success",
            userProjects: userProjects,
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_user_projects_by_name = async (req, res) => {
    const [
        userId,
        projectName
    ] = [
      req.user.id,
      req.query.projectName
    ];
    const userProjectsByName = await models.project.retrieveUserProjectsByName({userId, projectName});
    res.send({
        status: "success",
        userProjectsByName
    });
}

const retrieve_sorted_user_projects_with_servers = async (req, res) => {
    const [
        userId,
        sortField,
        sortType,
        offset,
        limit
    ] = [
        req.user.id,
        req.params.sortField,
        req.params.sortType,
        req.params.offset,
        req.params.limit
    ]
    try {
        const [userSortedProjects, projectCount] = await models.project.retrieveUserSortedProjectsWithServers({userId, sortField, sortType, offset, limit});
        res.send({
            status: "success",
            userProjectsServers: userSortedProjects,
            projectCount: projectCount
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_all_user_projects = async (req, res) => {
    const userId = req.user.id;
    try {
        const userProjects = await models.project.retrieveAllUserProjects({userId});
        res.send({
            status: "success",
            userProjects: userProjects,
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_project = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const project = await models.project.retrieveProject({projectId});
        res.send({
            status: "success",
            project: project
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const delete_project = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const numberOfDeletedProjects = await models.project.deleteProject({projectId});
        res.send({
            status: "success",
            messages: [{
                text: "Проект успешно удален!"
            }],
            numberOfDeletedProjects: numberOfDeletedProjects
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

module.exports = {
    create_project,
    edit_project,
    retrieve_user_projects,
    retrieve_user_projects_by_name,
    retrieve_sorted_user_projects_with_servers,
    retrieve_all_user_projects,
    retrieve_project,
    delete_project
};