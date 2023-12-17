module.exports = (sequelize,Sequelize) => {
    const LogAPIArduino = sequelize.define('LogAPIArduino', {
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
        isReceived:{
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        dateTime: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });

    return LogAPIArduino;
}