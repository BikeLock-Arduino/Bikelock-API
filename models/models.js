const { LocationStatus } = require('../app');

module.exports =  (sequelize,Sequelize) => {
    // Model's import
    const Device =  require('./device.model')(sequelize,Sequelize);
    const Locking =  require('./locking.model')(sequelize,Sequelize);
    const LogAPIPhone =  require('./log-api-phone.model')(sequelize,Sequelize);
    const LogAPIArduino =  require('./log-api-arduino.model')(sequelize,Sequelize);
    const NotificationSent = require('./notification-sent.model')(sequelize,Sequelize);
    const LocationStatus = require('./location-status.model')(sequelize,Sequelize);

    // Define the association (foreignKey)
    NotificationSent.belongsTo(Device, {
        as:'device',
        foreignKey: 'deviceId',
    });
    LogAPIArduino.belongsTo(Device, {
        as:'device',
        foreignKey: 'deviceId',
    });
    Locking.belongsTo(Device, {
        as:'device',
        foreignKey: 'deviceId',
    });
    LocationStatus.belongsTo(Locking, {
        as:'locking',
        foreignKey: 'lockingId',
    });
    
    Device.hasMany(NotificationSent, {
        as: 'notificationSents',
        foreignKey: 'deviceId',
    });
    Device.hasMany(LogAPIArduino, {
        as: 'logAPIArduinos',
        foreignKey: 'deviceId',
    });
    Device.hasMany(Locking, {
        as: 'lockings',
        foreignKey: 'deviceId',
    });
    Locking.hasMany(LocationStatus, {
        as: 'locationStatus',
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