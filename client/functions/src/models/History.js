// eslint-disable-next-line no-unused-vars
module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {})

  History.associate = function (models) {
    History.belongsTo(models.User)
    History.belongsTo(models.Song)
  }

  return History
}
