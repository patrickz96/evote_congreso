/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('process_type', {
    id_process_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_electoral_process: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'electoral_process',
        key: 'id_electoral_process'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'process_type'
  });
};
