const db = require('../database');
const getPassword = require("../ulils/utils");

db.User.create({ username: "Ilya",  password: getPassword("qwerty123") });
db.User.create({ username: "Anna",  password: getPassword("qwerty123") });
db.User.create({ username: "Denis",  password: getPassword("qwerty123") });