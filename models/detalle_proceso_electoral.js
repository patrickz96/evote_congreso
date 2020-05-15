/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalle_proceso_electoral', {
    id_det_proc_elec: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_lista_electoral: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    }
  }, {
    tableName: 'detalle_proceso_electoral'
  });
};
