const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'tb_sessionsWhats',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nameSessions: {
        type: Sequelize.STRING,
      },
      sessionsJson: {
        type: Sequelize.TEXT,
      },
      idUser: {
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
  