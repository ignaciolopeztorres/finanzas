import { DataTypes, Model } from "sequelize";
import sequelize from "../core/config/sequelize.config.js";

import User from "./user.model.js";
// Define the CuentaUsuario model

class CuentaUsuario extends Model { }

CuentaUsuario.init({
    idCuentaUsuario: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
    },
    money: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD',
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'activo',
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tableName: 'cuentas',
    timestamps: true,
    sequelize,
});

//define association with User model
CuentaUsuario.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
User.hasMany(CuentaUsuario, { foreignKey: 'userId', as: 'cuentas', onDelete: 'CASCADE' });

export default CuentaUsuario;