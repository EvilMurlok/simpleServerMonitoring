let db = require('../database.js');

db.sequelize.sync().then(() => {
    console.log("Сервер ожидает подключения...");
}).catch(err => console.log(err));