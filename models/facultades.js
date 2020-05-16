/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facultades', {
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'escuelas',
        key: 'id_facultad'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'facultades'
  });
};
