const inquirer = require("inquirer");
const connection = require("./connection");
const viewOptions = [
    "Departments",
    "Roles",
    "Employees",
    "Update Employees",
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
                    updateEmployee();

                case updateOptions[4]:
                    connection.end();
                    break;
            }
        })
}