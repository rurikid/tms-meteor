// Methods related to projects

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects.js';

Meteor.methods({

  insertProject: function(project) {
    check(project.name, String);
    check(project.supervisor, String);
    check(project.client, String);

    var name = project.name;
    var supervisor = project.supervisor;
    var client = project.client;
    var budget = project.budget;
    var employees = project.employees;

    return Projects.insert({
      name,
      supervisor,
      client,
      budget,
      employees,
    });
  },

	deleteProject(id) {
    check(id, String);

    return Projects.remove({ _id: id }, function (error, result) {
    	if (error) {
    		console.log("Error removing project: ", error);
    	} else {
    		console.log("Project removed: " + result);
    	}
    });
  },

  editProject(project) {
    check(project.name, String);
    check(project.supervisor, String);
    check(project.client, String);

    return Projects.update(project._id, {$set: {
      name: project.name,
      supervisor: project.supervisor,
      client: project.client,
      budget: project.budget,
      employees: project.employees,

    }});
  },

  removedSupervisor(employeeID) {
    check(employeeID, String);
    var projects = Projects.find({'supervisor': employeeID});

    projects.forEach(function(project) {
      if (project.supervisor === employeeID) {
        Projects.update(project._id, {$set: {
          supervisor: '',
        }});
      }
    });
  },
})