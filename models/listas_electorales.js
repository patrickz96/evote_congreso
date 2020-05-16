/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('listas_electorales', {
    id_lista_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'votacion',
        key: 'id_lista_electoral'
      }
    },
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    id_dptoaca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    id_escuela: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    id_tipo_proc_elec: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo_representacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    representacion: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'listas_electorales'
  });
};
