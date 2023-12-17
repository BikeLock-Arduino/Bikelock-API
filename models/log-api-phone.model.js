module.exports = (sequelize,Sequelize) => {
    const LogAPIPhone = sequelize.define('LogAPIPhone', {
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
    return LogAPIPhone;
}
