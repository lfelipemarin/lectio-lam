// eslint-disable-next-line no-unused-vars
module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {})

  Bookmark.associate = function (models) {
    Bookmark.belongsTo(models.User)
    Bookmark.belongsTo(models.Song)
  }

  return Bookmark
}
