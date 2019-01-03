// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// Cypress.Commands.add("login", function(email, password){
//   var email    = email || "joe@example.com"
//   var password = password || "foobar"
//
//   var log = Cypress.Log.command({
//     name: "login",
//     message: [email, password],
//     consoleProps: function(){
//       return {
//         email: email,
//         password: password
//       }
//     }
//   })
//
//   cy
//     .visit("/login", {log: false})
//     .contains("Log In", {log: false})
//     .get("#email", {log: false}).type(email, {log: false})
//     .get("#password", {log: false}).type(password, {log: false})
//     .get("button", {log: false}).click({log: false}) //this should submit the form
//     .get("h1", {log: false}).contains("Dashboard", {log: false}) //we should be on the dashboard now
//     .url({log: false}).should("match", /dashboard/, {log: false})
//     .then(function(){
//       log.snapshot().end()
//     })
// })
