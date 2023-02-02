'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    
    
  }
  Todos.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,

     },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      // validate: {
      //   notNull: { msg: 'task must have a name' },
      //   notEmpty: { msg: 'name can not be empty'}

      // }
    },
  }, {
    sequelize,
    tableName: 'todos',
    modelName: 'Todos',
  });
  return Todos;
};