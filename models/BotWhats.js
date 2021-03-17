const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'tb_botWhats',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nameSessions: {
        type: Sequelize.STRING,
      },
      botJson: {
        type: Sequelize.TEXT,
      },
      activated: {
        type: Sequelize.INTEGER,
      },
      dateCreation: {
        type: Sequelize.DATE,
      },
    },
    {
        timestamps: false,
        freezeTableName: true 
    },
  );
  