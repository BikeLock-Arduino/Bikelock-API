const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const cors = require('cors');
const port = 80;

// Connect to SQLite database using Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log, //Log queries to the console
});

// Synchronize the database and create tables
sequelize.sync({ logging: console.log })
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Middleware for JSON parsing
app.use(express.json());

// Middlewares for CORS policy avoidance
app.use(cors({
  allowedHeaders: ['Content-Type'],
}));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Models = require('./models/models')(sequelize,Sequelize);

// Use the routes from routes.js
const routes = require('./routes/routes')(db);
app.use(routes);

module.exports = db;
