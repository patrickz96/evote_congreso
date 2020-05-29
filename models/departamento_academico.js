/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('departamento_academico', {
    id_dpto_aca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facultad',
        key: 'id_facultad'
      }
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'departamento_academico'
  });
};
