// models/Transaccion.js
/**
 * Modelo de transacciones
 */
import { DataTypes, Model } from 'sequelize';
import sequelize from '../core/config/sequelize.config.js';

class Transaccion extends Model { }

Transaccion.init({
    idTransaccion: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    type: {
        type: DataTypes.ENUM('ingreso', 'egreso'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'transaccion',
    timestamps: true, // createdAt, updatedAt
});

export default new Transaccion();
