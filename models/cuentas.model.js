import { Category } from './category.model.js';
import { DataTypes, Model } from "sequelize";
import sequelize from "../core/config/sequelize.config.js";

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
    tipoCuenta: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: ['banco', 'tarjeta de crédito', 'efectivo', 'otro'],
        defaultValue: 'otro',
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
}, {
    tableName: 'cuentas',
    timestamps: true,
    underscored: true,
});

export default CuentaUsuario;