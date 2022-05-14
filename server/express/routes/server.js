const express = require('express');

const middlewaresAuth = require('../middleware/authorization');
const serverControllers = require('../controllers/server');

const router = express.Router();

router.get('/server/delete-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.delete_server);
router.get('/server/retrieve-project-servers/:projectId/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_project_servers);

router.get('/server/view-server-by-tag/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_server_by_tags);
router.get('/server/retrieve-user-servers/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_user_servers);
router.get('/server/retrieve-servers-by-hostname-ip/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_user_servers_by_hostname_ip);
router.get('/server/retrieve-available-servers-to-create-tag/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_available_servers_to_create_tag);
router.get('/server/retrieve-filtered-user-servers/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_filtered_user_servers);
router.get('/server/retrieve-user-sorted-servers/:sortField/:sortType/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_user_sorted_servers);
router.get('/server/retrieve-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.retrieve_server_in_project);

router.post('/server/update-server/:projectId/:serverId/', middlewaresAuth.checkNotAuthenticated, serverControllers.update_server);
router.post('/server/create-server/', middlewaresAuth.checkNotAuthenticated, serverControllers.create_server);

module.exports = router;