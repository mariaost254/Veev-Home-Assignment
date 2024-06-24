const Project = require('../models/project');
const { NotFoundError } = require('../middleware/errors');
const { v4: uuidv4 } = require('uuid');


exports.getAll = async (req, res, next) => {
    let projects = await Project.getAllProjects();

    if (projects.length === 0) {
        throw new NotFoundError('Could not find any projects.');
    }

    const response = {
      projects: projects.map(project => {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            startingBudget: project.startingBudget,
            currentCost: project.currentCost,
            status: project.status,
            dailyEstimatedCost : project.dailyEstimatedCost,
            warning: project.warning
        };
      })
    };
    res.status(200).json(response);
};

exports.updateProject = async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const { status, currentCost } = req.body;
      let projects = await Project.getAllProjects();
      let project = projects.find(p => p.id === projectId);
  
      if (!project) {
        throw new NotFoundError('Could not find project.');
      }
  
      if (status) {
        project.status = status;
      }

      //if current cost was manually updated 
      if (currentCost) {
        const current = project.currentCost;
        if(current + currentCost > project.startingBudget * 0.5){
            project.status = 'Forced-Closed';
        } else {
            project.currentCost = currentCost;
        }
    }
  
      await Project.saveProject(project);
  
      res.status(200).json({ message: 'Project updated', project });
    } catch (err) {
      next(err);
    }
  };



  exports.getProjectById = async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const project = await Project.getProjectById(projectId);

      const response = {
              id: project.id,
              name: project.name,
              description: project.description,
              startDate: project.startDate,
              endDate: project.endDate,
              startingBudget: project.startingBudget,
              currentCost: project.currentCost,
              status: project.status,
              dailyEstimatedCost : project.dailyEstimatedCost,
              warning: project.warning
      };

      if (!project) {
        throw new NotFoundError('Could not find project.');
      }
  
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };


  exports.addProject = async (req, res, next) => {
    try {
      const { name, description, startDate, endDate, startingBudget, currentCost, status } = req.body;
  
      const newProject = {
        id: uuidv4(),
        name,
        description,
        startDate,
        endDate,
        startingBudget,
        currentCost,
        status: status || 'Planning'
      };
  
      await Project.addProject(newProject);
  
      res.status(201).json({ message: 'Project added', project: newProject });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  };