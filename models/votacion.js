/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('votacion', {
    id_votacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_lista_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_asistencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_tipo_proceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'votacion'
  });
};
