/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proceso_electoral', {
    id_proceso_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero_procesos: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NO IDEA'
    },
    apertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
    },
    cierre: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
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
    tableName: 'proceso_electoral'
  });
};
