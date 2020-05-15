/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('procesos_electorales', {
    id_proc_elec: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tipos_proceso',
        key: 'id_proc_elec'
      }
    },
    anio_proceso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numero_procesos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'procesos_electorales'
  });
};
