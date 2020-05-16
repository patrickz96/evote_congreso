/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('electoral_list', {
    id_electoral_list: {
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
    id_process_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'process_type',
        key: 'id_process_type'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type_representation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    representation: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'electoral_list'
  });
};
