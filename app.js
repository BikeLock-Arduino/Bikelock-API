const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3000;

// Connect to SQLite database using Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log, //Log queries to the console
});

// Define the models
const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true
  },
  battery: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Device.create({
  id:1,
  battery:0
});

const Locking = sequelize.define('Locking', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true
  },
  eventDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isFinished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isFinishedConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  location:{
    type: DataTypes.STRING,
    allowNull: true
  }
});
/**
 * Location status of the 
 */
const LocationStatus = sequelize.define('LocationStatus', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

/**
 * Log for the notification that were sent to the phone
 */
const NotificationSent = sequelize.define('LocationNotificationSentStatus', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true
  },
  content:{
    type: DataTypes.STRING,
    allowNull: true
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

/**
 * Log for the data received/sent by/to the Arduino
 */
const LogAPIArduino = sequelize.define('LogAPIArduino', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true
  },
  content:{
    type: DataTypes.STRING,
    allowNull: true
  },
  isReceived:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

/**
 * Log for the data received/sent by/to the Phone (outside notifications)
 */
const LogAPIPhone = sequelize.define('LogAPIPhone', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true
  },
  content:{
    type: DataTypes.STRING,
    allowNull: true
  },
  isReceived:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
});


// Define the association
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

// Synchronize the database and create tables
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Middleware for JSON parsing
app.use(express.json());

// Use the routes from routes.js
const routes = require('./routes');
app.use(routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { Device,Locking,LocationStatus,NotificationSent,LogAPIArduino,LogAPIPhone };