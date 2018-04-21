import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import { Projects } from '../../../api/projects/projects.js'

//MS ADDED--------------
import  '../../../ui/pages/reports/reports.js'
import  '../../../ui/pages/timesheet/timesheets.js'


import './generatedReports.html';

//Global variables
var timeSheetKeyArray = []; // array to hold keys in json object since json object are not sorted
var timeSheetJson = {}; //Holds data to be displayed

function getStringDate(date, dateFormat) {
  return (moment(date).format(dateFormat));
}

function getTotalHoursForTimeChunks(timeChunksArray) {
  var hours = 0;
  timeChunksArray.forEach(function (doc) {
    var start = doc.startTime.split(':');
    var end = doc.endTime.split(':');

    var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));

    hours = hours + (total / 60);

  }, function(error) {
    alert(error.error);
  })
  return hours;
}

Template.generatedReports.onCreated( function () {
  
  console.log("Report Type", FlowRouter.getParam("reportType"));
  console.log("ProjectId", FlowRouter.getParam("projectId"));
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
  Meteor.subscribe('timesheets.all');
  Meteor.subscribe('timechunks.all');

});


Template.generatedReports.events({

    'click #back': function(event){
      event.preventDefault();
          //$('#editProjectModal').modal('hide');
    },
});
Template.generatedReports.helpers({ 
  isDaily() {
    console.log("Report Type", FlowRouter.getParam("reportType"));
    var isDaily = FlowRouter.getParam("reportType") == "daily";
    console.log("Showing Daily", isDaily);
    return isDaily;
  }
});

Template.reportTimesheets.helpers({ 


    // finds and retrieves supervisor name
    getUsersName: function() {
      return (Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName);
    },

      // returns all user timesheets
  timesheets() {
    var timesheets = [];
    var result = Timesheets.find({'employee': Meteor.user()._id});
    
    var fectchResult = result.fetch();
    

    //consolidatedArray.push.apply(fectchResult);
    fectchResult.forEach(function (entry) {
      var timechunks = Timechunks.find({'timesheet': entry._id}).fetch();
      
      var timeChunksArray = [];

      timechunks.forEach(function (timeChunk) {
        timeChunksArray.push(timeChunk);
      });

      var totalHours = getTotalHoursForTimeChunks(timeChunksArray);
      
     
      if (FlowRouter.getParam("reportType") == "daily") {//Check if daily
        var dateString = getStringDate(entry.date, 'dddd, MMMM Do YYYY');
        timeSheetKeyArray.push(dateString);

        var valueJson = {};
        valueJson["timeChunks"] = timeChunksArray;


        valueJson["totalHours"] = totalHours;

        if(timeSheetJson[dateString] == null) {
         timeSheetJson[dateString] = valueJson;
        } else {
          timeSheetJson[dateString].timechunks.push(timeChunksArray);
        }

      } else if(FlowRouter.getParam("reportType") == "weekly") {//Check if weekly
  
      }

    });
    
    // var targetWeek = Session.get('selectedTargetWeek');

    // result.forEach(function (doc) {
    //   if (moment(doc.date).week() === (moment(targetWeek).week())) {
    //     timesheets.push(doc);
    //   }
    // });
    // return timesheets;

    return timeSheetKeyArray;
  },

  timeSheetTotalHours: function(key) {
    console.log("Inside TimeSheet JSON");
    return timeSheetJson[key].totalHours;
  },

  timeSheetJSON: function(key) {
    console.log("Inside TimeSheet JSON");
    return timeSheetJson[key];
  },
  
  // returns all associated timechunks
  timechunks: function(key) {
    var timechunk =  timeSheetJson[key].timeChunks;
    console.log("Printing TimeChunk", timechunk);
    return timeSheetJson[key].timeChunks;
  },
  // finds and retrieves project name
  getProjectName: function(project) {
    // search for project
    var result = Projects.findOne({"_id": project});

    // known as guarding (are we finding anything in the query)
    var name = result && result.name;

    return result.name;
  },
  // determines if an employee can modify a timesheet
  isTimely: function(date) {
    return (moment(date).week() >= moment(moment().subtract(1, 'week')).week());
  },
  // returns true if the current user owns the timesheet
  isOwner: function(timesheetID) {
    return (timesheetID === Meteor.user()._id);
  },
  // returns number of hours worked in a day

  // returns number of hours worked in a timechunk
  getTimechunkHours: function(startTime, endTime) {
    var start = startTime.split(':');
    var end = endTime.split(':');

    var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));

    return total / 60;
  },
  // returns target view week
  getTargetWeek: function() {
    var targetWeek = Session.get('selectedTargetWeek');

    if (!targetWeek) {
      var newWeek = moment().format("YYYY-MM-DD");
      Session.set('selectedTargetWeek', newWeek);
      targetWeek = newWeek;
      console.log("!targetWeek");
    }

    console.log('get ' + targetWeek);
    return moment(targetWeek).startOf('week').format("MMMM Do YYYY");
  },
  getHumanDate: function(date) {
    return (moment(date).format('dddd, MMMM Do YYYY'));
  }
});
