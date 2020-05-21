/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school', {
    id_school: {
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
    },
    nues: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'school'
  });
};
