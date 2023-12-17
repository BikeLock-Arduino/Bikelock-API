const { LocationStatus } = require('../app');

module.exports =  (sequelize,Sequelize) => {
    // Model's import
    const Device =  require('./device.model')(sequelize,Sequelize);
    const Locking =  require('./locking.model')(sequelize,Sequelize);
    const LogAPIPhone =  require('./log-api-phone.model')(sequelize,Sequelize);
    const LogAPIArduino =  require('./log-api-arduino.model')(sequelize,Sequelize);
    const NotificationSent = require('./notification-sent.model')(sequelize,Sequelize);
    const LocationStatus = require('./location-status.model')(sequelize,Sequelize);
    
    // Adding a device for proof of concept
    let checkDeviceOne = Device.findByPk(1);
    if(checkDeviceOne == null){
        Device.create({
            battery:-1
        });
    }

    // Define the association (foreignKey)
    NotificationSent.belongsTo(Device, {
        foreignKey: 'deviceId',
    });
    LogAPIArduino.belongsTo(Device, {
        foreignKey: 'deviceId',
    });
    Locking.belongsTo(Device, {
        foreignKey: 'deviceId',
    });
    LocationStatus.belongsTo(Locking, {
        foreignKey: 'lockingId',
    });
    
    Device.hasMany(NotificationSent, {
        foreignKey: 'deviceId',
    });
    Device.hasMany(LogAPIArduino, {
        foreignKey: 'deviceId',
    });
    Device.hasMany(Locking, {
        foreignKey: 'deviceId',
    });
    Locking.hasMany(LocationStatus, {
        foreignKey: 'lockingId',
    });

    // Attach models to global object
    var Models = {};
    Models.Device = Device;
    Models.Locking = Locking;
    Models.LogAPIPhone = LogAPIPhone;
    Models.LogAPIArduino = LogAPIArduino;
    Models.NotificationSent = NotificationSent;
    Models.LocationStatus = LocationStatus;

    // Export
    return Models;
}