/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vote', {
    id_vote: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_electoral_process: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'electoral_process',
        key: 'id_electoral_process'
      }
    },
    id_elector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'electoral_census',
        key: 'id_elector'
      }
    },
    id_electoral_list: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'electoral_list',
        key: 'id_electoral_list'
      }
    },
    assistence: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2020-01-01 00:00:00'
    }
  }, {
    tableName: 'vote'
  });
};
