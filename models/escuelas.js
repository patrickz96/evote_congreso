/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('escuelas', {
    id_escuela: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'listas_electorales',
        key: 'id_escuela'
      }
    },
    id_facultad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    nues: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'escuelas'
  });
};
