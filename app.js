const express = require('express');
const morgan = require('morgan');

const db = require('./database');
const getPassword = require('./ulils/utils');
const app = express();

const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.send("Hello, world!");
});

app.get('/users/', async (req, res) => {
    const users = await db.User.findAll({
        attributes: ["username", "createdAt"],
    });
    res.json(users);
});

app.post('/users/', async (req, res) => {
    if (!req.body.password){
        res.status(403).send({error: "Password required!"});
    }
    console.log(req.body.password);
    const user = await db.User.create({ username: req.body.username,  password: getPassword(req.body.password) });
    res.json(user);
});

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`));