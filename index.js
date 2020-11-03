const inquirer = require("inquirer");
const connection = require("./connection");
const viewOptions = [
    "Departments",
    "Roles",
    "Employees",
    "Add Employee",
    "Exit"
];

const employees = [
    "Kite-Man",
    "Polka-Dot Man",
    "Bane",
    "Mr. Freeze",
    "The Penguin",
    "The Joker",
    "exit"
]

const updateInfo = [
    "Name",
    "Power",
    "department",
    "exit"
];

search();

function search() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Choose option:",
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

                case viewOptions[4]:
                    connection.end();
                    break;
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
    
}