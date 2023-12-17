module.exports = (sequelize,Sequelize) => {
    const LocationStatus = sequelize.define('LocationStatus', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement:true,
          primaryKey:true
        },
        location: {
          type: Sequelize.STRING,
          allowNull: true
        },
        dateTime: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });

    return LocationStatus;
}