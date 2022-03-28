let sequelize = require('../sequelize');

sequelize.sync().then(() => {
    console.log("Сервер ожидает подключения...");
}).catch(err => console.log(err));
