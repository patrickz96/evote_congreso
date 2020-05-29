/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('estudiante', {
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'elector',
        key: 'id_elector'
      }
    },
    id_escuela: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'escuela',
        key: 'id_escuela'
      }
    },
    cui: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'estudiante'
  });
};
