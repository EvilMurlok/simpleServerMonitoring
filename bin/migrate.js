let sequelize = require('../sequelize/index');

sequelize.sync().then(() => {
    console.log("Сервер ожидает подключения...");
}).catch(err => console.log(err));
