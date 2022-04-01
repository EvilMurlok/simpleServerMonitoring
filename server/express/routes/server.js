const express = require('express');

const middlewaresAuth = require('../middleware/authorization');
const serverControllers = require('../controllers/server');

const router = express.Router();

router.get('/delete-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.delete_server);
router.get('/retrieve-project-servers/:projectId/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_project_servers);
router.get('/view-server-by-tag/:tagId/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_server_by_tag);
router.get('/view-server/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_server_in_project);
// router.get('/show-servers-amount/:offset/:limit/', middlewaresAuth.checkNotAuthenticated, serverControllers.show_servers_amount);

router.post('/update-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.update_server);
router.post('/create-server/:projectId/', middlewaresAuth.checkNotAuthenticated, serverControllers.create_server);

module.exports = router;