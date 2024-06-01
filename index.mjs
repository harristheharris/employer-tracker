console.log("Eating");
//import the stuff we need
//inquirer

import inquirer from 'inquirer';
//our connection
import db from './db/connection.js'

const aTest1 = db.query(`SELECT * FROM department`)
console.log(aTest1);

//we'll start out server with our database connections
//if the connection is made with no error, run the app
db.connect(err => {
    if (err) throw err;
    console.log('we connected booooooi');
    // db.query(`SELECT * FROM department`, function (err, result, fields) {
    //     if (err) throw err;
    //     console.log(result);
    // })
    console.log(`Run app`);
    runApp();
})

//creating prompt to gtfo if user wants
var doWeExit = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'exit',
        message: 'Main Menu or Exit?',
        choices: ['Main Menu', 'Exit']
    }]).then((answers) => {
        if (answers.exit === 'Main Menu') {
            runApp();
        } else if (answers.exit === 'Exit') {
            db.end();
            console.log("Logging Out");
        }
    })
}

//the actual app
var runApp = function () {
    //we prompt user with options [View Departments, View Roles, View Employess, Add Department, Add Role, Add An Employee, Update Employee Role ]
    inquirer.prompt([{
        type: 'list',
        name: 'selectScreen',
        message: 'Select one of the options',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {
        console.log("in answers??");
        // console.log(answers);
        //if the user choose View Departments
        if (answers.selectScreen === 'View Departments') {
            console.log("did i get here?");
            //then we will query for for the all department info
            db.query('SELECT * FROM department', (err, result) => {
                if (err) throw err;
                console.log('All Departments');
                console.table(result);
                doWeExit();

            });

            //if the user choose View Roles
        } else if (answers.selectScreen === 'View Roles') {
            //then we will query for for the all roles info
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log('All Roles');
                console.table(result)
                doWeExit();
            })

            //if the user choose View Employees    
        } else if (answers.selectScreen === 'View Employees') {
            //then we will query for for the all employee info\
            db.query(`SELECT * FROM  employee`, (err, result) => {
                if (err) throw err;
                console.log('All Employees');
                console.table(result)
                doWeExit();
            })
            //if the user chooses Add Department 
        } else if (answers.selectScreen === 'Add A Department') {
            //then prompt the user to input a new department name
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'Name the department',
                //validate that the user inputted
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Add A Department!');
                        return false;
                    }
                }
                //then add the user input to the depatment table
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`)
                    doWeExit();
                });
            })
            //if the user chooses Add Role
        } else if (answers.selectScreen === 'Add A Role') {
            //So we first actually have to grab all the possible departmetns so they can be selected from for the third question. Why did this take me so long
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;

                //then prompt the user to input 
                inquirer.prompt([
                    //role title
                    {
                        type: 'input',
                        name: 'role',
                        message: 'Name of Role?',
                        //validate there is an input
                        validate: roleString => {
                            if (roleString) {
                                return true;
                            } else {
                                console.log('Add a Role');
                                return false;
                            }
                        }
                    },
                    //role salary
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Salary for role',
                        validate: salaryInt => {
                            if (salaryInt) {
                                return true;
                            } else {
                                console.log('Add a Salary');
                                return false;
                            }
                        }
                    },
                    //role depertment belongs to
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.department) {
                            var department = result[i];
                        }
                    }
                    //then add the new role to the role table
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`)
                        doWeExit();
                    });
                })
            });

            //if the user chooses Add Employee
        } else if (answers.selectScreen === 'Add An Employee') {

            // we have to load in both the employee table and role table as they will be options later
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                //then prompt the user to input
                inquirer.prompt([
                    //first name
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter Employee First Name',
                        validate: firstName => {
                            if (firstName) {
                                return true;
                            } else {
                                console.log('Add a First Name');
                                return false;
                            }
                        }
                    },

                    //last name
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter Employee Last Name',
                        validate: lastName => {
                            if (lastName) {
                                return true;
                            } else {
                                console.log('Add A Salary');
                                return false;
                            }
                        }
                    },

                    //role (this will be a list of current roles that the user may select from)
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Employees role?',
                        //the choices will be all the roles we have, we will cycle through each one, add them to a array and have them be the choices
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    //validate that we are using an existing role
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    //then add the new employee to the employee table
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager_id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        doWeExit();
                    });
                })
            });

            //if the user choose Update Employee Role
        } else if (answers.selectScreen === 'Update An Employee Role') {
            //get access to the following tables
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                //then show a list of employee to choose from
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employees role do you want to update?',

                        //we cycle through a list of employees by last name
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    //then prompt to what role the employee should be changed to
                    {

                        type: 'list',
                        name: 'role',
                        message: 'New role?',
                        //cycle through all the roles
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {

                    //validatation that the name does exist
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    //validation that role exists
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    //then update that employee on the employee table
                    db.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: role }, { last_name: name }], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee} role to the database.`)
                        doWeExit();
                    });
                })
            });
        } else if (answers.selectScreen === "Log Out"){
            doWeExit();
        }
    })
}
//notes: it might be easier to create lib but we'll see

