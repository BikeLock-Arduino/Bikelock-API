const express = require('express');
const router = express.Router();
const { Device,Locking,LocationStatus,NotificationSent,LogAPIArduino,LogAPIPhone } = require('./app');

//GET logs
router.get('/logArduino', async (req, res) => {
  try {
    const logArduino = await LogAPIArduino.findAll();
    res.json(logArduino);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/logPhone', async (req, res) => {
  try {
    const logPhone = await LogAPIPhone.findAll();
    res.json(logPhone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/logNotif', async (req, res) => {
  try {
    const logNotif = await NotificationSent.findAll();
    res.json(logNotif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//----LOCKING----\\
//POST locking/phone/:deviceId
router.post('/locking/phone/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  try {
    //check if a locking already exists
    const currentLocking = await Locking.findOne({
      where: {
        deviceId: deviceId,
        isFinishedConfirmed : false
      }
    });
    if(currentLocking != null){
      res.status(409)
    } else {
      const newLocking = await Locking.create(
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

      await addToPhoneLogs(deviceId + "# Locking for a device", new Date(), true);
    } 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET  locking/phone/:deviceId (get the status of the locking)
router.get('/locking/phone/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  try {
    //check if a locking already exists
    const currentLocking = await Locking.findOne({
      where: {
        deviceId: deviceId,
        isFinishedConfirmed : false
      }
    });
    res.json(currentLocking);

    await addToPhoneLogs(deviceId+"# Check if there is pending status",new Date(),false);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET  locking/device/:id (check if a locking process is pending)
router.get('locking/device/:id', async (req, res) => {
  const { id } = req.params;
  try {
    //check if a locking already exists
    const currentLocking = await Locking.findOne({
      where: {
        deviceId: id,
        isFinishedConfirmed : false
      }
    });
    res.json(currentLocking);

    await addToArduinoLogs(deviceId,"Check if there is pending status",new Date(), false);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST locking/device/:id (confirm locking)
router.post('locking/device/:id', async (req, res) => {
  const { id } = req.params;
  const { battery, location } = req.body;
  try {
    //check if a locking already exists
    const currentLocking = await Locking.findOne({
      where: {
        deviceId: id,
        isFinishedConfirmed : false
      }
    });
    const currentDevice = await Device.findByPk(id);
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

      await addToArduinoLogs(id,"Confirm the locking for the locking ID: " + currentLocking.id + " / battery: " + battery + " / location: " + location, new Date(), true);
    } 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST locking/device/:id/alarm
router.post('/locking/device/:id/alarm', async (req, res) => {
  const { id } = req.params;
  const { battery, location } = req.body;
  try {
    const currentLocking = await LocationStatus.findOne({
      where: {
        deviceId: id,
        isFinishedConfirmed : false
      }
    });
    const currentDevice = await Device.findByPk(id);
    if(currentLocking == null || currentDevice == null){
      res.status(400)
    } else {
      currentDevice.battery = battery;
      currentDevice.save();
      const newStatus = await LocationStatus.create(
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
      
      await addToArduinoLogs(id,"Add a location status for the alarm linked to locking ID: " + currentLocking.id + " / battery: " + battery + " / location: " + location, new Date(), true);
    } 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET  locking/phone/:deviceId/alarm (check for alarm on phone -> checking at LocationStatus table)
router.get('locking/phone/:deviceId/alarm', async (req, res) => {
  const { deviceId } = req.params;
  try {
    //check if a locking already exists
    const currentLocking = await Locking.findOne({
      where: {
        deviceId: deviceId,
        isFinishedConfirmed : false
      }
    });
    if(currentLocking == null){
      res.status(400);
    } else {
      const currentStatuS = await LocationStatus.findAll({
        where: {
          lockingId: currentLocking.id
        }
      });
    }
    res.json(currentStatuS);

    await addToPhoneLogs("GET status for alarm linked to locking ID: " + currentLocking.id,new Date(),false);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//----UNLOCKING----\\
//POST locking/phone/:deviceId/unlock
router.post('/locking/phone/:deviceId/unlock', async (req, res) => {
  const { deviceId } = req.params;
  try {
    //check if a locking already exists
    const currentLocking = await Locking.findOne({
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

      await addToPhoneLogs(deviceId +"# Unlocking for locking ID: " + currentLocking.id,new Date(),true);
    } 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST locking/device/:id/unlock (confirm unlocking)
router.post('locking/device/:id/unlock', async (req, res) => {
  const { id } = req.params;
  const { battery } = req.body;
  try {
    //check if a locking already exists
    const currentLocking = await Locking.findOne({
      where: {
        deviceId: id,
        isFinished : true,
        isFinishedConfirmed : false
      }
    });
    const currentDevice = await Device.findByPk(id);
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
      await addToArduinoLogs(id,"Confirm unlock for locking ID: " + currentLocking.id+  " / battery: " + battery, new Date(), true);
    } 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function addToPhoneLogs(msg,timestamp, isPost){
  const newLog = await LogAPIPhone.create(
    { 
      dateTime: timestamp, 
      content: msg,
      isReceived: isPost
    }
  );
}

async function addToArduinoLogs(deviceId,msg,timestamp, isPost){
  const newLog = await LogAPIArduino.create(
    { 
      dateTime: timestamp, 
      content: msg,
      deviceId: deviceId,
      isReceived: isPost
    }
  );
}

async function addToNotifLogs(deviceId,msg,timestamp){
  const newLog = await NotificationSent.create(
    { 
      dateTime: timestamp, 
      content: msg,
      deviceId: deviceId
    }
  );
}

module.exports = router;