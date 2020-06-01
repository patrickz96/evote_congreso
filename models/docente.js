/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('docente', {
    id_docente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_dpto_aca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'departamento_academico',
        key: 'id_dpto_aca'
      }
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'docente'
  });
};
