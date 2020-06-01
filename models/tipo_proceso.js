/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  Tipo_Proceso = sequelize.define('tipo_proceso', {
    id_tipo_proceso: {
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
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
    }
  }, {
    tableName: 'tipo_proceso'
  });

  Tipo_Proceso.associate = function(models) {
    models.tipo_proceso.belongsTo(models.proceso_electoral, {foreignKey: 'id_proceso_electoral'});
  };
  return Tipo_Proceso;
};
