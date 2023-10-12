const { Model, DataTypes } = require('sequelize');

const sequelize = require('sequelize');

class Role extends Model {}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salary: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'department',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        modelname: 'departments'
    }
);

module.exports = Role;