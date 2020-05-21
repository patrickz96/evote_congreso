/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  
  var Process_type = sequelize.define('process_type', {
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

  Process_type.associate = function(models) {
    models.process_type.belongsTo(models.electoral_process, {foreignKey: 'id_electoral_process'});
  };
  return Process_type;
};
