module.exports = (sequelize,Sequelize) => {
    const Locking = sequelize.define('Locking', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement:true,
          primaryKey:true
        },
        eventDateTime: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        isConfirmed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        isFinished: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        isFinishedConfirmed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        location:{
          type: Sequelize.STRING,
          allowNull: true
        }
      });

    return Locking;
}