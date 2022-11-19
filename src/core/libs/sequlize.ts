import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(
    process.env.DB_Name,
    process.env.DB_UserName,
    process.env.DB_Password,
    {
        host: process.env.DB_Host,
        port: 3306,
        dialect: 'mysql',
        logging: process.env.DB_QueryLog == "1"
    }
);
export default sequelize;