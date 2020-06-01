/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  Lista_Electoral = sequelize.define('lista_electoral', {
    id_lista_electoral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_tipo_proceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipo_proceso',
        key: 'id_tipo_proceso'
      }
    },
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'facultad',
        key: 'id_facultad'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '/logos/url_logo.png'
    },
    representacion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NO IDEA'
    },
    tipo_representacion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NO IDEA'
    },
    estado: {
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
    tableName: 'lista_electoral'
  });

  Lista_Electoral.associate = function(models) {
    models.lista_electoral.belongsTo(models.tipo_proceso, {foreignKey: 'id_tipo_proceso'});
    models.lista_electoral.belongsTo(models.facultad, {foreignKey: 'id_facultad'});
  };
  return Lista_Electoral;
};
