//import the stuff we need
//inquirer
const inquirer = require('inquirer')
//our connection
const db = require('./db/connection')

//we'll start out server with our database connections
//if the connection is made with no error, run the app
db.connect(err => {
    if (err) throw err;
    console.log('we connected booooooi');
    runApp();
})

//creating prompt to gtfo if user wants
var doWeExit = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'Exit',
        message: 'Main Menu or Exit?',
        choices: ['Main Menu', 'Exit']
    }]).then((answers) => {
        if (answers.prompt === 'Main Menu') {
            runApp();
        } else if (answers.prompt === 'Exit') {
            db.end();
            console.log("Logging Out");
        }
    })
}

//the actual app
var runApp = function () {
    //we prompt user with options [View Departments, View Roles, View Employess, Add Department, Add Role, Add employee, Update Employee Role ]
    inquirer.prompt([{
        type: 'list',
        name: 'selectScreen',
        message: 'Select one of the options',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
    }]).then((answers) => {

        //if the user choose View Departments
        if (answers.prompt === 'View Departments') {
            //then we will query for for the all department info
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log('All Departments');
                console.table(result);
                doWeExit();

            })

            //if the user choose View Roles
        } else if (answers.prompt === 'View Roles') {
            //then we will query for for the all roles info
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log('All Roles');
                console.table(result)
                doWeExit();
            })

            //if the user choose View Employees    
        } else if (answers.prompt === 'View Employees') {
            //then we will query for for the all employee info\
            db.query(`SELECT * FROM  employee`, (err, result) => {
                if (err) throw err;
                console.log('All Employees');
                console.table(result)
                doWeExit();
            })
        }


        //if the user chooses Add Department 
        //then prompt the user to input a new department name
        //then add the user input to the depatment table

        //if the user chooses Add Role
        //then prompt the user to input 
        //role title
        //role salary
        //then add the new role to the role table

        //if the user chooses Add Employee
        //then prompt the user to input
        //first name
        //last name
        //role (this will be a list od current roles that the user may select from)
        //then add the new employee to the employee table

        //if the user choose Update Employee Role
        //then show a list of employee to choose from
        //then prompt to what role the employee should be changed too
        //then update that employee on the employee table
    })
}
//notes: it might be easier to create lib but we'll see

