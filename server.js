const inquirer = require('inquirer');
const mysql = require('mysql2');

const  db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'company_db'
    }
);

function menu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
                'View Departments',
                'View Roles',
                'View Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee role',
                'End'
            ] 
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View Departments':
                viewDepartments();
                break;
            case 'View Roles':
                viewRoles();
                break;
            case 'View Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee role':
                updateEmployee();
                break;
            default:
                db.end();
        }
    });
};

function viewDepartments() {
    db.query('SELECT department_name, id FROM department', (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
};

function viewRoles() {
    db.query('SELECT role.title, role.id, role.salary, department.department_name as department FROM role Join department On role.department_id = department.id', (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
};

function viewEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title as job_title, department.department_name as department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) as manager From employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id' , (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the new department?',
            validate: (answer) => {
                if (answer !== '') {
                    return true;
                } return 'Please add the name of the Department';
            }
        }
    ]).then(answer => {
        db.query('INSERT INTO department (department_name) VALUES (?)', [answer.department], (err, results) => {
            if (err) throw err;
            console.log('Department successfully added');
            menu();
        }
        )
    })
};

menu();