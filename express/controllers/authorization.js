const { models } = require("../../sequelize");
const getPassword = require('../ulils/utils');

// Rendering "/index" view file
const index = async (req, res) => {
    res.render('index.twig', {
        name: "Ilya",
        title: "Your Website"
    });
};

module.exports = {
    index
}