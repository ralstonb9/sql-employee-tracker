INSERT INTO department(department_name)
VALUES ('Operations'), ('Human Resources'), ('Finance');

INSERT INTO role(title, salary, department_id) 
VALUES ('Accountant', 80000.0, 3),
('Assitant', 40000.0, 1),
('Labor Rep', 100000.0, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Ross', 'Brown', 3, NULL),
('Taylor', 'White', 1, 1);