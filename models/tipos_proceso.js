/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tipos_proceso', {
    id_tipo_proc_elec: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'listas_electorales',
        key: 'id_tipo_proc_elec'
      }
    },
    id_proc_elec: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    nomb_proc_elec: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'tipos_proceso'
  });
};
