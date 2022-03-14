const express = require('express');

const middlewaresAuth = require('../middleware/authorization');
const middlewaresServer = require('../middleware/server');
const serverControllers = require('../controllers/server');

const router = express.Router();

router.post('/add-server/', middlewaresAuth.checkNotAuthenticated,
    middlewaresServer.validate_data_addition, serverControllers.add_server_post);

router.get('/show-servers/', middlewaresAuth.checkNotAuthenticated, serverControllers.show_servers);
router.get('/show-servers-amount/:offset/:limit/', middlewaresAuth.checkNotAuthenticated, serverControllers.show_servers_amount);

router.get('/view-server/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.view_server);
router.post('/update-server-post/:serverId/', middlewaresAuth.checkNotAuthenticated,
    middlewaresServer.validate_data_update, serverControllers.update_server);
router.get('/delete-server/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.delete_server);

module.exports = router;