module.exports = (sequelize,Sequelize) => {
    const NotificationSent = sequelize.define('NotificationSent', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement:true,
          primaryKey:true
        },
        content:{
          type: Sequelize.STRING,
          allowNull: true
        },
        dateTime: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });

    return NotificationSent;
}