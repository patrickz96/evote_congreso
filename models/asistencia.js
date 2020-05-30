/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asistencia', {
    id_asistencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_padron_electoral: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'padron_electoral',
        key: 'id_padron_electoral'
      }
    },
    clave_ingreso: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_At: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_At: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'asistencia'
  });
};
