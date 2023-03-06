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
    static associate({ User }) {
      // define association here
      this.belongsTo( User, {foreignKey: 'userId'})
    }
    toJSON(){
      return{ ... this.get(), password: undefined}
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
    userId: {
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    
    },
  }, {
    sequelize,
    tableName: 'todos',
    modelName: 'Todos',
  });
  return Todos;
};
