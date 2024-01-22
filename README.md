# Bikelock API

API for Bikelock project. Coupled with an Arduino and a Web/Mobile App.
The API is using **Node.js** + **Express** for the running server. The ORM to access the database is **Sequelize** and the database server used is **SQLite**.

## Routes
### TEST 
*GET /api/device* : get the devices that are in the database and create the first one if he is missing
### LOGS
*GET /api/logArduino* : log of the routes used by the Arduino
*GET /api/logPhone* : log of the routes used by the App
*GET /api/logNotif* : log of the notifaction sent (not implemented)
### LOCKING
*GET /api/locking/phone/:deviceId* : get the locking status of the Arduino from the phone
*POST /api/locking/phone/:deviceId* : INITIATE the locking sequence of the Arduino from the App
*GET /api/locking/device/:id* : check from the Arduino if their is a pending locking status
*POST /api/locking/device/:id* : CONFIRM from the Arduino the pending locking status
*POST /api/locking/device/:id/alarm* : send an alarm with the new location of the Arduino
### UNLOCKING
*POST /api/locking/phone/:deviceId/unlock* : INITIATE the locking sequence of the Arduino from the App
*POST /api/locking/device/:id/unlock* : CONFIRM from the Arduino the unlocking

##  Models
All the models used in the API are describe in the "./models" folder.