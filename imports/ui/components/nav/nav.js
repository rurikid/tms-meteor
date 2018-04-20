import { Users } from '../../../api/users/users.js';

import './nav.html';

  // evaluates for supervisors
Template.nav.helpers({
  userName() {
    var userId = Meteor.user().profile;
    return userId.firstName + " " +userId.lastName;
  },
  isSupervisor: function(position) {
    return ((Meteor.user().profile.position === 'Supervisor') || (Meteor.user().profile.position === 'Administrator'));
  },
  isAdmin: function(position) {
    return ((position === 'Administrator'));
  },
});

Template.nav.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('/login');
  },
  'click .login': function(event){
    event.preventDefault();
    FlowRouter.go('/login');
  },
  'click .profile': function(event){
    event.preventDefault();
    FlowRouter.go('/profile');
  },
  'click .projects': function(event){
    event.preventDefault();
    FlowRouter.go('/projects');
  },
  'click .timesheets': function(event){
    event.preventDefault();
    FlowRouter.go('/timesheets');
  },
  'click .team': function(event){
    event.preventDefault();
    FlowRouter.go('/team');
  },
  'click .teamTimesheet': function(event){
    event.preventDefault();
    FlowRouter.go('/teamTimesheet');
  },
  'click .reports': function(event){
    event.preventDefault();
    FlowRouter.go('/reports');
  },
  'click .employees': function(event){
    event.preventDefault();
    FlowRouter.go('/employees');
  }
});
