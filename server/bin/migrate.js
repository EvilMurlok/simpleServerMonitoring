let sequelize = require('../sequelize');

sequelize.sync({force: true}).then(() => {
    console.log("Сервер ожидает подключения...");
}).catch(err => console.log(err));
