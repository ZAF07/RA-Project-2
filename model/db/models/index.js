/* eslint-disable import/no-unresolved */
// Sequelize package
import sequelizePackage from 'sequelize';

// Config files
import allConfig from './config/config.js';

// Model
import initUserModel from './user.mjs';

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = initUserModel(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
