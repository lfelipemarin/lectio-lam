module.exports = (sequelize, DataTypes) => {
  const Lectio = sequelize.define('Lectio', {
    lectio: DataTypes.TEXT,
    meditatio: DataTypes.TEXT,
    oratio: DataTypes.TEXT,
    contemplatio: DataTypes.TEXT
  })

  Lectio.associate = function (models) {
    Lectio.belongsTo(models.User)
  }

  return Lectio
}
