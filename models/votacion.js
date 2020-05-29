/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('votacion', {
    id_votacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_lista_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lista_electoral',
        key: 'id_lista_electoral'
      }
    },
    id_asistencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'asistencia',
        key: 'id_asistencia'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'votacion'
  });
};
