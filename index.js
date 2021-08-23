const inquirer = require("inquirer");
const mysql = require("mysql");

require("console.table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    initialPrompt();
});

  function initialPrompt() {
    inquirer
      .prompt({
        type: "list",
        name: "task",
        message: "Would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department", 
          "Add a Role",     
          "Add an Employee",
          "Update an Employee Role",
          "Add Role",
          "End"]
    })
      .then(function ({ task }) {
        switch (task) {
          case "View All Employees":
            viewEmployee();
            break;
          case "Add an Employee":
            addEmployee();
            break;
          case "Update an Employee Role":
            updateEmployeeRole();
            break;
          case "Add a Role":
            addRole();
            break; 
          case "End":
            connection.end();
            break;
        }
    });
}


function addEmployee() {
    console.log("Adding a new employee!")
    var query =
      `SELECT r.id, r.title, r.salary 
        FROM role r`
  
        connection.query(query, function (err, res) {
            if (err) throw err;
  
      const employeeQuestions = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
        }));
  
    console.table(res);
   
  
    addingQuestions(employeeQuestions);
    });
}





function addingQuestions(employeeQuestions) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the new employee's role?",
          choices: employeeQuestions
        },
      ])
      .then(function (answer) {
        console.log(answer);
        var query = `INSERT INTO employee SET ?`
        connection.query(query,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.roleId,
            manager_id: answer.managerId,
          },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
  
            initialPrompt();
        });
    });
}