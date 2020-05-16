/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('academic_department', {
    id_academic_department: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'academic_department'
  });
};
