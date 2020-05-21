/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

var Electoral_list = sequelize.define('electoral_list', {
    id_electoral_list: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_faculty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'faculty',
        key: 'id_faculty'
      }
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
      allowNull: true
    },
    type_representation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    representation: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'electoral_list'
  });

  Electoral_list.associate = function(models) {
    models.electoral_list.belongsTo(models.faculty, {foreignKey: 'id_faculty'});
    models.electoral_list.belongsTo(models.process_type, {foreignKey: 'id_process_type'});
  };
  return Electoral_list;
};
