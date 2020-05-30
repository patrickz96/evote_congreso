/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facultad', {
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '02301'
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'facultad'
  });
};
