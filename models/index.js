const Department = require('./Department');
const Role = require('./Role');
const Employee = require('./Employee');

Employee.belongsTo(Department, {
    foreignKey: 'department_id'
});

Role.belongsTo(Department, {
    foreignKey: 'department_id'
});

Employee.hasMany(Employee, {
    foreignKey: 'manager_id'
});