const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../databases/projects.json');

const getAllProjects = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        let projects = JSON.parse(data);
        const currentDate = new Date();
  
        projects = projects.map(project => {
          const startDate = new Date(project.startDate);
          const days = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
          const cost = project.startingBudget * 0.1; 
          project.currentCost = Math.min(project.startingBudget, cost * days);

          const endDate = new Date(project.endDate);
          const daysTotal = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
          project.dailyEstimatedCost = cost;
          project.warning = cost * daysTotal > project.startingBudget? "Not engouh budget": "";
          return project;
        });
  
        resolve(projects);
      });
    });
  };

const saveProject = (updatedProject) => {
    return getAllProjects().then(projects => {
      const index = projects.findIndex(project => project.id === updatedProject.id);
      console.log(projects[index]);
      console.log(updatedProject);
      if (index != -1) {
        projects[index] = updatedProject;
      } else {
        projects.push(updatedProject);
      }
      return saveAllProjects(projects);
    });
  };


  const getProjectById = (projectId) => {
    return getAllProjects().then(projects => {
     const project =  projects.find(project => project.id === projectId);

     const currentDate = new Date();
     if(project.status.toLowerCase()!= "completed" || project.status.toLowerCase()!= "forced-closed"){
     const startDate = new Date(project.startDate);
     const days = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
     const cost = project.startingBudget * 0.1; 
     project.currentCost = Math.min(project.startingBudget, cost * days);

     const endDate = new Date(project.endDate);
     const daysTotal = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
     project.dailyEstimatedCost = cost;
     project.warning = cost * daysTotal > project.startingBudget? "Not engouh budget": "";
     }
      return project;
    });
  };

  const saveAllProjects = (projects) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf8', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };

  const addProject = (newProject) => {
    return getAllProjects().then(projects => {
      projects.push(newProject);
      return saveAllProjects(projects);
    });
  };

module.exports = {
  getAllProjects, saveProject, getProjectById, addProject, saveAllProjects
};