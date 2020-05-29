/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('padron_electoral', {
    id_padron_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_proceso_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proceso_electoral',
        key: 'id_proceso_electoral'
      }
    },
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'elector',
        key: 'id_elector'
      }
    },
    enviado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    clave_secreta: {
      type: DataTypes.STRING,
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
    tableName: 'padron_electoral'
  });
};
