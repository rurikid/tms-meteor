import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './employees.html';

Template.employees.onCreated(function () {
    Meteor.subscribe('users.all');
  });

Template.employees.helpers({
  // returns all users
  users() {
    return Meteor.users.find({});
  },
  // returns true for admin
  isAdmin() {
    return (Meteor.user().profile.position === 'Administrator');
  },
});

Template.employees.events({
  'click .deleteEmployee'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const ids = document.getElementsByName('employeeID');
    var id;
    for (i = 0; i < ids.length; i++) {
      if (ids[i].checked){
        id = ids[i].value; 
      }
    }

    Meteor.call('deleteEmployee', id, (error) => {
      if (error) {
        alert(error.error);
      } else {

        // success alert
        return swal({
          title: "Removed!",
          text: "Employee Removed",
          button: {
            text: "Close",
          },
          icon: "success"
        });
      }
    });
  },

  'click .newEmployee'(event) {
    // Prevent default browser behavior
    event.preventDefault();
    Meteor.call('editEmployeeModal', null);
  },

  'click .editEmployee'(event) {
    // Prevent default browser behavior
    event.preventDefault();

    // Get value from form element
    const ids = document.getElementsByName('employeeID');
    var id;
    for (i = 0; i < ids.length; i++) {
      if (ids[i].checked){
        id = ids[i].value; 
      }
    }

    if (id) {
      Meteor.call('editEmployeeModal', id);
    }
  }
});