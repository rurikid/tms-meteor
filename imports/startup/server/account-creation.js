Accounts.onCreateUser(function(options, user) {
  // Use provided profile in options, or create an empty object
  user.profile = options.profile || {};

  // Assigns first and last names to the newly created user object
  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;
  user.roles = ["position"];
  user.profile.salary = options.salary;
  user.profile.payData = options.payData;

  // Returns the user object
  return user;
});