const inquirer = require("inquirer");
const connection = require("./connection");
const figlet = require("figlet")
const viewOptions = [
    "Departments",
    "Roles",
    "Employees",
    "Add Employee",
    "Update Employee Role",
    "Add Department",
    "Add Role",
    "Exit"
];

const employees = [
    "Kite-Man",
    "Polka-Dot Man",
    "Bane",
    "Mr. Freeze",
    "The Penguin",
    "The Joker"
]

const role_id = [
    1,
    2,
    3,
    4,
    5,
    6
]

init();

function init() {
    console.log(console.log(figlet.textSync('Supervillian INC. Intranet Tracking System', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    })));
    search()
}

function search() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please Choose an Option",
            choices: viewOptions
        })
        .then((answer) => {
            switch (answer.action) {
                case viewOptions[0]:
                    departmentView();
                    break;

                case viewOptions[1]:
                    roleView();
                    break;

                case viewOptions[2]:
                    employeeView();
                    break;

                case viewOptions[3]:
                    addEmployee();
                    break;

                case viewOptions[4]:
                    updateRole();
                    break;

                case viewOptions[5]:
                    addDepartment();
                    break;

                case viewOptions[6]:
                    addRole();
                    break;

                case viewOptions[7]:
                    connection.end();
            }
        })
}

function departmentView() {
    let sqlString = "Select * FROM department";
    connection.query(sqlString, (err, result) => {
        if (err) throw err;
        console.table(result)
        search();
    })
}

function employeeView() {
    let sqlString = "SELECT name, power, title, salary FROM employee ";
    sqlString += "LEFT JOIN role";
    sqlString += " ON employee.role_id = role.id"
    connection.query(sqlString, (err, result) => {
        if (err) throw err;

        console.table(result)
        search()
    })
}

function roleView() {
    let sqlString = "SELECT * FROM role";
    connection.query(sqlString, (err, result) => {
        if (err) throw err;

        console.table(result)
        search();
    })
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of this employee?",
            validate: async (input) => {
                if (/^[a-zA-Z ]+$/.test(input)) {
                    return true;
                }
                console.log("\nPlease enter a valid name");
                return false;
            }
        },
        {
            type: "input",
            name: "power",
            message: "What is the power of this employee?",
            validate: async (input) => {
                if (/^[a-zA-Z ]+$/.test(input)) {
                    return true;
                }
                console.log("\nPlease enter a valid name");
                return false;
            }
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the role id of this employee?",
            choices: role_id
        }
    ])
        .then((data) => {
            console.log(data);
            addEmployeeUpdate(data.name, data.power, data.role_id);
        });
}

//stage two, updateDB
function addEmployeeUpdate(name, power, role_id) {
    let addEmployeeQuery = "INSERT INTO employee (name, power, role_id) VALUES (?,?,?)";
    connection.query(addEmployeeQuery, [name, power, role_id], function (err, res) {
        if (err) throw err;
        console.log(name + ": role " + role_id + " was added.");
        //return to main menu
        search();
    });
}

function updateRole() {
    let updateName;
    let updateRole;
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "which employee do you want to update?",
            choices: employees
        },
        {
            type: "list",
            name: "role",
            message: "which role do you want to update to?",
            choices: role_id
        }
    ])
        .then((data) => {
            updateName = data.employee;
            updateRole = data.role;
            let pickNameRoleIdQuery = "SELECT role_id FROM employee WHERE  CONCAT(name) = ?;";
            connection.query(pickNameRoleIdQuery, [data.employee], function (err, res) {
                if (err) throw err;
                //verification of different update
                if (res.role_id === data.role) {
                    console.log("It seems like you update to the same role AS before.");
                    inquirer.prompt({
                        type: "confirm",
                        name: "update",
                        message: "Do you want to do the update again?"
                    })
                        .then(function (data) {
                            if (data.update) updateRole(role_id, employees);
                            else updateRoleDB(updateName, updateRole);
                        });
                } else updateRoleDB(updateName, updateRole);
            });
        })
}

function updateRoleDB(updateName, updateRole) {
    let updateRoleQuery = "UPDATE employee SET role_id = ? WHERE  CONCAT(name)=?;";
    connection.query(updateRoleQuery, [updateRole, updateName], function (err, res) {
        if (err) throw err;
        console.log(updateName + "'s role was updated to " + updateRole);
        search();
    })
}

function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of the new department?",
        })
        .then((answer) => {
            var query = "INSERT INTO department (name) VALUES ( ? )";
            connection.query(query, answer.department, (err, res) => {
                console.log(`You have added this department: ${(answer.department).toUpperCase()}.`)
            })
            departmentView();
        })
}


function addRole() {
    connection.query('SELECT * FROM department',(err, res) => {
        if (err) throw (err);
        inquirer
            .prompt([{
                name: "title",
                type: "input",
                message: "What is the title of the new role?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the new role?",
            },
            {
                name: "departmentName",
                type: "list",
                // is there a way to make the options here the results of a query that selects all departments?`
                message: "Which department does this role fall under?",
                choices: function () {
                    var choicesArray = [];
                    res.forEach(res => {
                        choicesArray.push(
                            res.name
                        );
                    })
                    return choicesArray;
                }
            }
            ])
            // in order to get the id here, i need a way to grab it from the departments table 
            .then((answer) => {
                const department = answer.departmentName;
                connection.query('SELECT * FROM department', (err, res) => {

                    if (err) throw (err);
                    let filteredDept = res.filter((res) => {
                        return res.name == department;
                    }
                    )
                    let id = filteredDept[0].id;
                    let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                    let values = [answer.title, parseInt(answer.salary), id]
                    console.log(values);
                    connection.query(query, values,
                        function (err, res, fields) {
                            console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
                        })
                    roleView()
                })
            })
    })
}