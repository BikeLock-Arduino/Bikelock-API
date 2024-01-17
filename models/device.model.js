module.exports = (sequelize,Sequelize) => {
    const Device = sequelize.define('Device', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement:true,
          primaryKey:true
        },
        battery: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
    });
    
    return Device;
}
