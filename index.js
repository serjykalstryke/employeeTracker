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

const role_id = [
    1,
    2,
    3,
    4,
    5,
    6
]

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
                   return;
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
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of this employee?",
                validate: async (input) => {
                    if (/^[a-zA-Z]+$/.test(input)) {
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
                    if (/^[a-zA-Z]+$/.test(input)) {
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
            .then(function (data) {
                console.log(data);
                addEmployeeUpdate(data.name, data.power, data.role_id);
            });
    }
    
    //stage two, updateDB
    function addEmployeeUpdate(name, power, role_id){
        let addEmployeeQuery = "INSERT INTO employee (name, power, role_id) VALUES (?,?,?)";
        connection.query(addEmployeeQuery, [name, power, role_id], function (err, res) {
            if (err) throw err;
            console.log(name + ": role " + role_id + " was added.");
            //return to main menu
            search();
        });
    }