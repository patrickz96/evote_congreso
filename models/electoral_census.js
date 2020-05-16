/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('electoral_census', {
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_faculty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_academic_department: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_school: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    elector_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login_key: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'electoral_census'
  });
};
