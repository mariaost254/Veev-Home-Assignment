const express = require('express');
const router = express.Router();
const ProjectsController = require('../controllers/projectsController');
const apicache = require('apicache');
let cache = apicache.middleware;


router.get('/',cache('2 minutes'), ProjectsController.getAll);
router.get('/:projectId', ProjectsController.getProjectById);
router.patch('/:projectId', ProjectsController.updateProject);
router.post('/', ProjectsController.addProject);

module.exports = router;