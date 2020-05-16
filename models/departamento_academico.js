/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('departamento_academico', {
    id_dptoaca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'listas_electorales',
        key: 'id_dptoaca'
      }
    },
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'departamento_academico'
  });
};
