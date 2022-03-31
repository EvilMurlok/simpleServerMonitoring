const {models} = require("../sequelize");

const testUserMethods = async () => {
    let [username, phone, email, password, confirm_password] = ["Qwe001", "89645571055", "ilya311200@gmail.com", "qwerty123", "qwerty123"];
    try {
        const registered_user = await models.user.registerUser({username, phone, email, password, confirm_password});
    } catch (e) {
        console.log(e.messages);
    }
    [username, phone, email, password, confirm_password] = ["Qwe002", "89645571054", "ilya311200@gmail.com", "qwerty123", "qwerty123"];
    try {
        const registered_user = await models.user.registerUser({username, phone, email, password, confirm_password});
    } catch (e) {
        console.log(e.messages);
    }
    [username, phone, email, password, confirm_password] = ["Qwe002", "89645775652", "prokyror_311200@mail.ru", "qwerty123", "qwerty123"];
    try {
        const registered_user = await models.user.registerUser({username, phone, email, password, confirm_password});
    } catch (e) {
        console.log(e.messages);
    }
    let userId = 2;
    try {
        const edited_user = await models.user.editUser({username, phone, email, userId});
    } catch (e) {
        console.log(e.messages);
    }
    [username, phone, email] = ["Qwe001", "89645571055", "prokyror_311200@mail.ru"];
    try {
        const edited_user = await models.user.editUser({username, phone, email, userId});
    } catch (e) {
        console.log(e.messages);
    }
    [username, phone, email] = ["Qwe002", "89991112233", "qwe003@mail.ru"];
    try {
        const edited_user = await models.user.editUser({username, phone, email, userId});
    } catch (e) {
        console.log(e.messages);
    }
    try {
        console.log(await models.user.retrieveUser({userId}));
        console.log(await models.user.retrieveUser({username}));
        console.log(await models.user.retrieveUser({phone}));
        console.log(await models.user.retrieveUser({email}));
        username = "Qwe003";
        console.log(await models.user.retrieveUser({username}));
    } catch (e) {
        console.log(e.messages);
    }

    userId = 3;
    try {
        console.log(await models.user.deletionUser({userId}));
    } catch (e) {
        console.log(e.messages);
    }

    [username, phone, email, password, confirm_password] = ["Qwe003", "89992223344", "qwe003@yandex.ru", "qwerty123", "qwerty123"];
    let registered_user = "";
    try {
        registered_user = await models.user.registerUser({username, phone, email, password, confirm_password});
    } catch (e) {
        console.log(e.messages);
    }

    userId = registered_user.id;
    try {
        console.log(await models.user.deletionUser({userId}));
    } catch (e) {
        console.log(e.messages);
    }

    [username, phone, email, password, confirm_password] = ["Qwe003", "89992223344", "qwe003@yandex.ru", "qwerty123", "qwerty123"];
    try {
        registered_user = await models.user.registerUser({username, phone, email, password, confirm_password});
    } catch (e) {
        console.log(e.messages);
    }
}

testUserMethods().then();