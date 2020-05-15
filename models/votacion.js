/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('votacion', {
    id_votacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_proc_elec: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    id_lista_electoral: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    asistencia: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'votacion'
  });
};
