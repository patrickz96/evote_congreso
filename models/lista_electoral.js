/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Lista_Electoral = sequelize.define('lista_electoral', {
    id_lista_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_tipo_proceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '/logos/url_logo.png'
    },
    representacion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NO DEFINIDA'
    },
    tipo_representacion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NO DEFINIDA'
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'lista_electoral'
  });
  Lista_Electoral.associate = function(models) {
    models.lista_electoral.belongsTo(models.tipo_proceso, {foreignKey: 'id_tipo_proceso'});
    models.lista_electoral.belongsTo(models.facultad, {foreignKey: 'id_facultad'});
  };
  return Lista_Electoral;
};
