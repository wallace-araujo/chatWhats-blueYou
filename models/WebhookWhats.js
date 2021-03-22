const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'tb_webhookWhats',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nameSessions: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      idUser: {
        type: Sequelize.INTEGER,
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
  