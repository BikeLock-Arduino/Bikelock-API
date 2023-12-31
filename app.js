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

// Synchronize the database and create tables
sequelize.sync()
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Middleware for JSON parsing
app.use(express.json());

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