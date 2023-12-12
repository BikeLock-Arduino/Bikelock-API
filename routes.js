const express = require('express');
const router = express.Router();
const { Device,Locking,LocationStatus,NotificationSent,LogAPIArduino,LogAPIPhone } = require('./app'); // Import the User model from the main app file

/** Example with a model named User with 2 fields - name and email
// POST a new user
router.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await User.create({ name, email });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific user by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

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
    } 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST locking/device/:id/alarm
//GET  locking/phone/:deviceId/alarm (check for alarm on phone -> checking at LocationStatus table)
//GET  locking/phone/:deviceId/

//----UNLOCKING----\\
//POST locking/phone/:deviceId/unlock
//POST locking/device/:id/unlock (confirm unlocking)


module.exports = router;