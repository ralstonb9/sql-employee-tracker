const { error } = require("console");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_db",
});

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee role",
          "End",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View Departments":
          viewDepartments();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee role":
          updateEmployee();
          break;
        default:
          db.end();
      }
    });
}

function viewDepartments() {
  db.query("SELECT department_name, id FROM department", (err, rows) => {
    if (err) throw err;
    console.table(rows);
    menu();
  });
}

function viewRoles() {
  db.query(
    "SELECT role.title, role.id, role.salary, department.department_name as department FROM role Join department On role.department_id = department.id",
    (err, rows) => {
      if (err) throw err;
      console.table(rows);
      menu();
    }
  );
}

function viewEmployees() {
  db.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title as job_title, department.department_name as department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) as manager From employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
    (err, rows) => {
      if (err) throw err;
      console.table(rows);
      menu();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the new department?",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Please add the name of the department.";
        },
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO department (department_name) VALUES (?)",
        [answer.department],
        (err, results) => {
          if (err) throw err;
          console.log("Department successfully added");
          menu();
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM department", (err, department) => {
    if (err) throw err;
    const departmentNames = department.map(({ department_name, id }) => ({
      name: department_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Please enter the role title.",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "Please add the role title.";
          },
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for this role.",
          validate: (answer) => {
            if (answer > 0) {
              return true;
            }
            return "Please enter the salary for this role.";
          },
        },
        {
          type: "list",
          name: "department",
          message: "What department is the role part of?",
          choices: departmentNames,
        },
      ])
      .then((answer) => {
        console.log(answer);
        db.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
          [answer.title, answer.salary, answer.department],
          (err, results) => {
            if (err) throw err;
            console.log("Role successfully added");
            menu();
          }
        );
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM role", (err, role) => {
    if (err) throw err;
    const roleNames = role.map(({ title, id }) => ({ name: title, value: id }));
    db.query('SELECT * FROM employee', (err, manager) => {
        if (err) throw err;
        const managerNames = manager.map(({ first_name, last_name, id}) => ({ name: `${first_name} ${last_name}`, value: id }));
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "Enter employee first name.",
              validate: (answer) => {
                if (answer !== "") {
                  return true;
                }
                return "Please enter a first name.";
              },
            },
            {
              type: "input",
              name: "last_name",
              message: "Enter employee last name.",
              validate: (answer) => {
                if (answer !== "") {
                  return true;
                }
                return "Please enter a last name.";
              },
            },
            {
              type: "list",
              name: "role",
              message: "Choose an employee role.",
              choices: roleNames,
            },
            {
              type: "list",
              name: "manager",
              message: "Who is their manager?",
              choices: managerNames,
            },
          ])
          .then((answer) => {
            console.log(answer)
            db.query(
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
              [answer.first_name, answer.last_name, answer.role, answer.manager],
              (err, results) => {
                if (err) throw err;
                console.log("Employee successfully added.");
                menu();
              }
            );
        });
      });
  });
}

function updateEmployee() {
    db.query('SELECT * FROM employee', (err, employee) => {
        if (err) throw err;
        const employeeNames = employee.map(({ first_name, last_name, id}) => ({ name: `${first_name} ${last_name}`, value: id }));
        db.query('SELECT * FROM role', (err, role) => {
            if (err) throw err;
            const roleNames = role.map(({ title, id}) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Choose an employee.",
                    choices: employeeNames,
                },
                {
                    type: "list",
                    name: "role",
                    message: "Choose a new employee role.",
                    choices: roleNames,
                },
            ]).then((answer) => {
                db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.role, answer.employee], err => {
                    if (err) throw err;
                    console.log('Employee role successfully updated.');
                    menu();
                });
            });
        });
    });
}

menu();
