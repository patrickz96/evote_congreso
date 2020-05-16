/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('faculty', {
    id_faculty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    tableName: 'faculty'
  });
};
