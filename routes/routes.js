const express = require('express');
const router = express.Router();

module.exports = (db) => {
  //GET logs
  router.get('/api/logArduino', async (req, res) => {
    try {
      const logArduino = await db.Models.LogAPIArduino.findAll();
      res.json(logArduino);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/api/logPhone', async (req, res) => {
    try {
      const logPhone = await db.Models.LogAPIPhone.findAll();
      res.json(logPhone);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/api/logNotif', async (req, res) => {
    try {
      const logNotif = await db.Models.NotificationSent.findAll();
      res.json(logNotif);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  //----LOCKING----\\
  //POST locking/phone/:deviceId
  router.post('/api/locking/phone/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    try {
      //check if a locking already exists
      const currentLocking = await db.Models.Locking.findOne({
        where: {
          deviceId: deviceId,
          isFinishedConfirmed : false
        }
      });
      if(currentLocking != null){
        res.status(409);
      } else {
        const newLocking = await db.Models.Locking.create(
          { 
            eventDateTime: new Date(), 
            isConfirmed: false,
            isFinished: false, 
            isFinishedConfirmed: false,
            location: "",
            deviceId: deviceId
          }
        );
        res.json(newLocking);
        try{
          await addToPhoneLogs(deviceId + "# Locking for a device", new Date(), true);
        }catch(err){
          console.error(err);
        }
      } 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //GET  locking/phone/:deviceId (get the status of the locking)
  router.get('/api/locking/phone/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    try {
      //check if a locking already exists
      const currentLocking = await db.Models.Locking.findOne({
        where: {
          deviceId: deviceId,
          isFinishedConfirmed : false
        }
      });
      res.json(currentLocking);
      try{
        await addToPhoneLogs(deviceId+"# Check if there is pending status",new Date(),false);
      }catch(err){
        console.error(err);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //GET  locking/device/:id (check if a locking process is pending)
  router.get('/api/locking/device/:id', async (req, res) => {
    const { id } = req.params;
    try {
      //check if a locking already exists
      const currentLocking = await db.Models.Locking.findOne({
        where: {
          deviceId: id,
          isFinishedConfirmed : false
        }
      });
      res.json(currentLocking);
      try{
        await addToArduinoLogs(id,"Check if there is pending status",new Date(), false);
      } catch(err){
        console.error('err addToArduinoLogs',err);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //POST locking/device/:id (confirm locking)
  router.post('/api/locking/device/:id', async (req, res) => {
    const { id } = req.params;
    const { battery, location } = req.body;
    try {
      //check if a locking already exists
      const currentLocking = await db.Models.Locking.findOne({
        where: {
          deviceId: id,
          isFinishedConfirmed : false
        }
      });
      const currentDevice = await db.Models.Device.findByPk(id);
      if(currentLocking == null || currentDevice == null){
        res.status(400);
      } else {
        //maj battery value
        currentDevice.battery = battery;
        currentDevice.save();
        //confirm locking + location
        currentLocking.isConfirmed = true;
        currentLocking.location = location;
        currentLocking.save();
        res.json(currentLocking);
        try{
          await addToArduinoLogs(id,"Confirm the locking for the locking ID: " + currentLocking.id + " / battery: " + battery + " / location: " + location, new Date(), true);
        } catch(err){
          console.error(err);
        }
      } 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //POST locking/device/:id/alarm
  router.post('/api/locking/device/:id/alarm', async (req, res) => {
    const { id } = req.params;
    const { battery, location } = req.body;
    try {
      const currentLocking = await db.Models.LocationStatus.findOne({
        where: {
          deviceId: id,
          isFinishedConfirmed : false
        }
      });
      const currentDevice = await db.Models.Device.findByPk(id);
      if(currentLocking == null || currentDevice == null){
        res.status(400)
      } else {
        currentDevice.battery = battery;
        currentDevice.save();
        const newStatus = await db.Models.LocationStatus.create(
          { 
            dateTime: new Date(), 
            location: location,
            lockingId: currentLocking.id
          }
        );
        res.json(newStatus);

        //TODO send a notification to the phone associated to the device
          //SEND NOTIF
          //ADD LOG TO NOTIF LOG
        try{
          await addToArduinoLogs(id,"Add a location status for the alarm linked to locking ID: " + currentLocking.id + " / battery: " + battery + " / location: " + location, new Date(), true);
        }catch(err){
          console.error(err);
        }
      } 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //GET  locking/phone/:deviceId/alarm (check for alarm on phone -> checking at LocationStatus table)
  router.get('/api/locking/phone/:deviceId/alarm', async (req, res) => {
    const { deviceId } = req.params;
    try {
      //check if a locking already exists
      const currentLocking = await db.Models.Locking.findOne({
        where: {
          deviceId: deviceId,
          isFinishedConfirmed : false
        }
      });
      if(currentLocking == null){
        res.status(400);
      } else {
        const currentStatuS = await db.Models.LocationStatus.findAll({
          where: {
            lockingId: currentLocking.id
          }
        });
      }
      res.json(currentStatuS);

      try{
        await addToPhoneLogs("GET status for alarm linked to locking ID: " + currentLocking.id,new Date(),false);
      }catch(err){
        console.error(err);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //----UNLOCKING----\\
  //POST locking/phone/:deviceId/unlock
  router.post('/api/locking/phone/:deviceId/unlock', async (req, res) => {
    const { deviceId } = req.params;
    try {
      //check if a locking already exists
      const currentLocking = await db.Models.Locking.findOne({
        where: {
          deviceId: deviceId,
          isFinished: false,
          isFinishedConfirmed : false
        }
      });
      if(currentLocking == null){
        res.status(400)
      } else {
        currentLocking.isFinished = true;
        currentLocking.save();
        res.json(currentLocking);

        try{
          await addToPhoneLogs(deviceId +"# Unlocking for locking ID: " + currentLocking.id,new Date(),true);
        }catch(err){
          console.error(err);
        }
      } 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //POST locking/device/:id/unlock (confirm unlocking)
  router.post('/api/locking/device/:id/unlock', async (req, res) => {
    const { id } = req.params;
    const { battery } = req.body;
    try {
      //check if a locking already exists
      const currentLocking = await db.Models.Locking.findOne({
        where: {
          deviceId: id,
          isFinished : true,
          isFinishedConfirmed : false
        }
      });
      const currentDevice = await db.Models.Device.findByPk(id);
      if(currentLocking == null || currentDevice == null){
        res.status(400);
      } else {
        //maj battery value
        currentDevice.battery = battery;
        currentDevice.save();
        //confirm locking + location
        currentLocking.isFinishedConfirmed = true;
        currentLocking.save();
        res.json(currentLocking);

        //TODO add log to Arduino LOG
        try{
          await addToArduinoLogs(id,"Confirm unlock for locking ID: " + currentLocking.id+  " / battery: " + battery, new Date(), true);
        }catch(err){
          console.error(err);
        }
      } 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  async function addToPhoneLogs(msg,timestamp, isPost){
    const newLog = await db.Models.LogAPIPhone.create(
      { 
        dateTime: timestamp, 
        content: msg,
        isReceived: isPost
      }
    );
  }

  async function addToArduinoLogs(deviceId,msg,timestamp, isPost){
    const newLog = await db.Models.LogAPIArduino.create(
      { 
        dateTime: timestamp, 
        content: msg,
        deviceId: deviceId,
        isReceived: isPost
      }
    );
  }

  async function addToNotifLogs(deviceId,msg,timestamp){
    const newLog = await db.Models.NotificationSent.create(
      { 
        dateTime: timestamp, 
        content: msg,
        deviceId: deviceId
      }
    );
  }

  // Routes to check if the API is working as intended
  router.get('/api/device',async (req,res) => {
    try {
      // DO NOT REMOVE -- Adding a device for proof of concept
      let checkDeviceOne = await db.Models.Device.findByPk(1);
      console.log('check',checkDeviceOne);
      if(checkDeviceOne == null){
        const created = await db.Models.Device.create({
            battery:-1
        });
        console.log('in creation');
        console.log(created);
      }
      const devices = await db.Models.Device.findAll();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}