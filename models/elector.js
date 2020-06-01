/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('elector', {
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ap_paterno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ap_materno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo_elector: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'elector'
  });
};
