/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asistencia', {
    id_asistencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_padron_electoral: {
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
    url_pdf: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'URL'
    },
    voto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'asistencia'
  });
};
