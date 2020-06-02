/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  Tipo_padron_electoral = sequelize.define('padron_electoral', {
    id_padron_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 'nextval(padron_electoral_id_padron_electoral_seq::regclass)',
      primaryKey: true
    },
    id_proceso_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.CHAR,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'padron_electoral'
  });

  Tipo_padron_electoral.associate = function(models) {
    models.padron_electoral.belongsTo(models.elector, {foreignKey: 'id_elector'});
  };
  return Tipo_padron_electoral;
};
