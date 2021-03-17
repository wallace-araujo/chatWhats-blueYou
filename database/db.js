const Sequelize = require("sequelize");
const dotenv = require ('dotenv').config();


const sequelize = new Sequelize(
  dotenv.parsed.DB_DATABASE,
  dotenv.parsed.DB_USER,
  dotenv.parsed.DB_PASS,
  {
    host: dotenv.parsed.DB_HOST,
    dialect: "mysql",
    operatorAliases: false,
    logging: false,
  },
);

module.exports = {
  sequelize
};