const {models} = require("../sequelize");

const testProjectMethods = async () => {
    let [userId, projectName] = [1, ""];
    let currentProject = "";

    // creation block
    try {
        currentProject = await models.project.createProject({userId, projectName});
    } catch (e) {
        console.log(e.messages);
    }

    projectName = "123@#$";
    try {
        currentProject = await models.project.createProject({userId, projectName});
    } catch (e) {
        console.log(e.messages);
    }

    for (userId of [1, 2]){
        projectName = `Qwe00${userId}_project`;
        try {
            currentProject = await models.project.createProject({userId, projectName});
        } catch (e) {

            console.log(e.messages);
        }

        projectName = `Qwe00${userId}00${userId}_project`;
        try {
            currentProject = await models.project.createProject({userId, projectName});
        } catch (e) {
            console.log(e.messages);
        }

        projectName = `Qwe00${userId}00${userId}00${userId}_project`;
        try {
            currentProject = await models.project.createProject({userId, projectName});
        } catch (e) {
            console.log(e.messages);
        }

        // same name error
        projectName = `Qwe00${userId}_project`;
        try {
            currentProject = await models.project.createProject({userId, projectName});
        } catch (e) {
            console.log("Same name error");
            console.log(e.messages);
        }
    }
    console.log("----------------------------------EDITION-------------------------------------");
    userId = 1;
    projectName = `Qwe00${userId}00${userId}_project`;
    let projectId = 2;
    try {
        currentProject = await models.project.editProject({userId, projectId, projectName});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    try {
        currentProject = await models.project.editProject({userId, projectId});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    projectId = 4
    try {
        currentProject = await models.project.editProject({userId, projectId, projectName});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

}

testProjectMethods().then();