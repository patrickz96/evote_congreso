/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrativo', {
    id_administrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_dependencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dependencia',
        key: 'id_dependencia'
      }
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'administrativo'
  });
};
