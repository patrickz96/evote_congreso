/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('padron_electoral', {
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'votacion',
        key: 'id_elector'
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
    tipo_elector: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ap_pat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ap_mat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clave_ingreso: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'padron_electoral'
  });
};
