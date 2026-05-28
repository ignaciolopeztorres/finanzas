import Sequelize from "sequelize";
import 'dotenv/config';

const sequelize = new Sequelize(process.env.NAME_DB, process.env.USER_DB, process.env.PASS_DB, {
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT, /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    port: process.env.PORT_DB
});

export default sequelize;