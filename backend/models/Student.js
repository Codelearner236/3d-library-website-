const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rollNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  exam: {
    type: DataTypes.STRING,
    defaultValue: 'General Assessment',
  },
}, {
  timestamps: true,
});

module.exports = Student;
