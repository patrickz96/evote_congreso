/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('electoral_process', {
    id_electoral_process: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '2020'
    },
    created_day: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
    },
    number_process: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    date_init: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'electoral_process'
  });
};
