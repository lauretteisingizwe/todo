'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Todos}) {
      // define association here
      this.hasMany( Todos, {foreignKey: 'userId'})
    }
    toJSON(){

      return{ ... this.get(), password: undefined}
    }
  }
  User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
  
       },
     name: {
      type: DataTypes.STRING,
      allowNull: false,
     },
     email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'must be a valid email'
        }
      }
     },
     password: {
      type: DataTypes.STRING,
      allowNull: false,
     }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};