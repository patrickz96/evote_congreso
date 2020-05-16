/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conteo_votos', {
    id_voto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_proc_elect: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_det_proc_elect: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo_proc_elec: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_lista: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_escuela: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_departamento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_general: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'conteo_votos'
  });
};
