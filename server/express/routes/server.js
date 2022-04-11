const express = require('express');

const middlewaresAuth = require('../middleware/authorization');
const serverControllers = require('../controllers/server');

const router = express.Router();

router.get('/server/delete-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.delete_server);
router.get('/server/retrieve-project-servers/:projectId/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_project_servers);
router.get('/server/view-server-by-tags/', middlewaresAuth.checkNotAuthenticated,serverControllers.retrieve_server_by_tags);
router.get('/server/view-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_server_in_project);

router.post('/server/update-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.update_server);
router.post('/server/create-server/', middlewaresAuth.checkNotAuthenticated, serverControllers.create_server);

module.exports = router;