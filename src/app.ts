import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sequelize from './core/libs/sequlize';
import { initModels } from './models/init-models';
const app = express();

//import libs
const corLibs = require("./core");
corLibs.forEach(lib => {
    require(`./core/libs/${lib}`)(app);
});

//connect DB
initModels(sequelize);