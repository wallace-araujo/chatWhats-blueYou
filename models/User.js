const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "tb_users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    userName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    isValid: {
      type: Sequelize.INTEGER,
    },
    type:{
        type: Sequelize.STRING,
    },
    dateCreation: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: false,
  },
);
